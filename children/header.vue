<template>
    <header class="header">
        <a class="header__back" @click="bindGoBack"></a>
        <span class="header__title">{{ title }}</span>
    </header>
</template>
<script>
    import cache from '../../utils/cache';
    import { LOCAL_KEY } from '../../utils/constants'
    import setTitle from '../../utils/setTitle'

    const FLIGHT_PARAMS = LOCAL_KEY.FLIGHT_PARAMS;

    export default {
        name: 'flight-header',
        data() {
            return {
                routeTo: null,
                routeFrom: null
            }
        },
        computed: {
            title() {
                const pageTitle = this.$route.meta && this.$route.meta.title
                setTitle(pageTitle)
                this.setWindowName(pageTitle)
                return pageTitle
            }
        },
        methods: {
            bindGoBack() {
                console.log('goBack $route to-from: ', this.routeTo, this.routeFrom)
                window.history.go(-1);

                // let [_to, _from] = [this.routeFrom, this.routeTo] // 交换路由from, to的值
                // if (!_from) {
                //     window.history.go(-1);
                // }
                // this.goBack(_from, _to)
            },
            goBack(_from, _to) {
                let origin = document.location.origin;
                let data = cache.local.get(FLIGHT_PARAMS);
                let url = origin + '/#/flightlist/go';
                console.log('hashchange router to-from: ', _to, _from)

                // m端和APP下执行不同的跳转方式
                let isAppGo = (url) => {
                    setTimeout(_ => {
                        window.location.href = url;
                    }, 0)
                }
                // 订单页后退到：回程、去程列表
                switch (_from.name) {
                    case 'submitorder' : {
                        console.log('来自填单页的后退操作：')
                        if (data.isRoundTrip) {
                            console.log('有往返行程，后退到返程列表')
                            // 异步触发
                            url = origin + '/#/flightlist/return';
                            isAppGo(url);
                            // window.location.replace(origin + '/#/flightlist/return')
                        } else {
                            console.log('单程，后退到去程列表')
                            // window.location.replace(origin + '/#/flightlist/go')
                            // 异步触发
                            isAppGo(url);
                        }
                        break
                    }
                    case 'return' : {
                        console.log('来自返程列表的后退操作：')
                        console.log('后退到去程列表')
                        // window.location.replace(origin + '/#/flightlist/go')
                        // 异步触发
                        isAppGo(url);
                        break
                    }
                    case 'go' : {
                        console.log('来自去程列表的后退操作：')
                        console.log('后退到首页')
                        // window.location.replace(origin + '/#/')
                        // 异步触发
                        url = origin + '/#/';
                        isAppGo(url);
                        break
                    }
                    case 'index' : {
                        console.log('来自首页的后退操作：')
                        console.log('后退到m.jd.id首页')
                        // TODO 跳出后再次回来，不知道后退到那个页面
                        // window.location.replace('//m.jd.id')
                        url = '//m.jd.id';
                        window.location.href = url;
                        break
                    }
                    default:
                        window.history.go(-1);
                        break
                }
            },
            // 设置travel落地页的window name
            setWindowName (pageTitle) {
                console.log('获取父页面的window对象', parent.window)
                if (parent.window && parent.window.setWindowName) {
                    const windowName = this.$route.name === 'index' ? 'Travel' : pageTitle
                    parent.window.setWindowName(windowName)
                }
            }
        },
        watch: {
            '$route'(to, from) {
                // 监测整个项目路由变化，跳转指定路径；
                this.routeTo = to
                this.routeFrom = from
            }
        }
    }
</script>
