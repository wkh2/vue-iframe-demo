<template>
    <div id="app" class="app scroll-content" :class="{'no-header':!showHeader}">
        <FlightHeader v-if="showHeader"/>
        <router-view></router-view>
    </div>
</template>

<script>
    import FlightHeader from './pages/header'
    import {
        isApp,
        isAndroid,
        isiOS
    } from './utils/isAPP'
    import {
        go
    } from './utils/routerLink'
    import * as types from './store/mutation-types'

    const REFRESH_TIME = 15 * 60 * 1000

    export default {
        name: 'app',
        components: {
            FlightHeader
        },
        data() {
            return {
                timerId: null
            }
        },
        mounted() {
        },
        updated() {
            document.getElementById('app').scrollTop = 0
            document.getElementById('app').scrollTo(0, 0)
            window.scroll(0, 0);
        },
        created() {
            window.ga('set', 'page', '/Refresh')
            window.ga('send', 'pageview')
        },
        methods: {
            // 全流程定时器， 当用户在全流程任何一个页面停留超过15分钟，强制刷新
            doRefresh(timeOut = REFRESH_TIME, callBackFn) {
                this.clearRefreshTimer();
                this.timerId = window.setTimeout(() => {
                    callBackFn && callBackFn();
                }, timeOut);
                if (isApp()) {
                    if (isAndroid()) {
                        window.ga('send', 'event', 'Android_flight_refresh2', 'click')
                    } else if (isiOS()) {
                        window.ga('send', 'event', 'IOS_flight_refresh2', 'click')
                    }
                } else {
                    window.ga('send', 'event', 'm_flight_refresh2', 'click')
                }
            },
            // 重新设置定时器
            reSetRefreshTime(timeOutNumber) {
                this.clearRefreshTimer();
                this.doRefresh(timeOutNumber, this.showRefreshConfirm);
            },
            // 清除定时器：
            clearRefreshTimer() {
                if (this.timerId) {
                    window.clearTimeout(this.timerId);
                }
            },
            showRefreshConfirm() {
                this.$confirm({
                    title: 'Halaman Kadaluarsa',
                    content: 'Waktu Anda Habis, Kami Akan Mengulangi\n' +
                    'Pencarian Anda',
                    confirmClassName: 'reset-confirm refresh-confirm',
                    confirmText: 'Refresh',
                    onConfirm: () => {
                        go({
                            name: 'flightlist'
                        }, this.$router);
                        // 页面重新渲染
                        setTimeout(() => {
                            window.location.reload(true);
                        }, 100)
                    }
                })
            },
            // 隐藏popup-picker popup-radio浮层
            hidePassengerBaggage() {
                let mask = document.querySelector('.vf-popup-mask');
                let datetimeMask = document.querySelector('.vf-datetime__mask');
                if (mask) {
                    mask.click();
                }
                if (datetimeMask) {
                    datetimeMask.click();
                }
            },
            // 清除confirm
            removeConfirm() {
                let confirm = document.querySelector('.reset-confirm');
                if (confirm) {
                    this.$confirm.hide()
                }
            }
        },
        computed: {
            showHeader() {
                if (isApp() || /travel/.test(window.location.href)) {
                    return false
                }
                const hasHeader = this.$route.meta && this.$route.meta.hasHeader
                if (hasHeader === false) {
                    return false
                }
                return true
            }
        },
        watch: {
            '$route'(to, from) {
                // 监测整个项目路由变化，如果有变化重新设置定时器；
                let excludedPathName = ['index', 'calendar', 'selectcity', 'order', 'coupon', 'errorPage'];

                if (excludedPathName.indexOf(to.name) < 0) {
                    this.reSetRefreshTime();
                } else {
                    // 非首页相关组件， 清理之前定时器， 不执行刷新
                    this.clearRefreshTimer();
                }
                // 如果路由变化，隐藏弹层
                this.hidePassengerBaggage();
                // 清除 Confirm
                this.removeConfirm();
                // from 如果有上一个页面来源，清除loading
                if (from) {
                    this.$loading.hide()
                }
                // 清除header
                this.$store.commit(types.SET_HEADER_TITLE, '')
                // 如果是使用ifram嵌套的业务线代码，需要向外层父页面传递消息
                if (window.top && window.top.postMessage) {
                    const isIndexPage = this.$route.name === 'index'
                    const pageTitle = this.$route.meta.title
                    window.top.postMessage(JSON.stringify({isIndexPage, pageTitle}), `${location.protocol}//m.jd.id/travel`)
                }
            }
        }
    }

</script>