<template>
    <div class="travel-iframe">
        <iframe v-show="iframeState" id="childApp" frameborder=0 name=iframeName scrolling=auto
                :src=iframeLink></iframe>
        <travel-loading v-if="showLoading"></travel-loading>
    </div>
</template>

<script>
    import TravelLoading from './t-loading';

    export default {
        name: 'travel-iframe',
        components: {
            TravelLoading
        },
        data() {
            return {
                showLoading: true,
                isTravelIndex: true
            };
        },
        props: {
            iframeState: {
                type: Boolean,
                default: true
            },
            iframeLink: String
        },
        computed: {
            domain() {
                return `${location.protocol}${this.iframeLink.split('/#')[0]}`
            }
        },
        watch: {
            $route(val) {
                console.log('watch-iframe-val', val)
            },
            'this.$store.state.pageTitle'(val) {
                console.log('watch-this.$store.state.pageTitle', val)
            }
        },
        mounted() {
            //   this.$showLoading()
            this.fnSetIframeSize();
            this.sendMessage('hi, 子页面，你好吗')
            this.addEvent(window, 'message', (e) => {
                if (e.origin === this.domain) {
                    const childData = JSON.parse(e.data)
                    const pageTitle = childData.isIndexPage ? 'Travel' : childData.pageTitle
                    this.$store.commit('setTitle', pageTitle)
                    if (pageTitle !== 'Travel') {
                        const oIframe = document.getElementById('childApp');
                        const clientHeight = document.documentElement.clientHeight
                        oIframe.style.height = clientHeight - 46 + 'px'
                    }
                    if (pageTitle) this.showLoading = false
                    console.log(childData, this.$store.state.pageTitle)
                }
            })
        },
        methods: {
            fnSetIframeSize() {
                // 获取iframe的dom
                const oIframe = document.getElementById('childApp');
                // 获取整个手机屏幕的宽、高
                let {
                    clientWidth,
                    clientHeight
                } = document.documentElement;
                // 获取tab-nav的高度
                const tabNavHeight =
                    document.getElementsByClassName('tab-nav') &&
                    document.getElementsByClassName('tab-nav')[0].offsetHeight;
                // 获取banner图的高度
                let bannerHeight = 120;
                if (
                    document.getElementsByClassName('adv-banner') &&
                    document.getElementsByClassName('adv-banner')[0]
                ) {
                    bannerHeight = document.getElementsByClassName('adv-banner')[0]
                        .offsetHeight;
                }
                console.log(' tabNavHeight - bannerHeight', tabNavHeight - bannerHeight)
                // iframe 的宽度高度
                oIframe.style.width = clientWidth + 'px';
                oIframe.style.height = clientHeight + 'px';
            },
            sendMessage(msg) {
                console.log(this.domain)
                document.getElementById('childApp').contentWindow.postMessage(msg, location.protocol + '//' + location.host)
            },
            addEvent(obj, trigger, fn) {
                if (obj.addEventListener) {
                    obj.addEventListener(trigger, fn, false)
                } else if (obj.attachEvent) {
                    obj.attachEvent(`on${trigger}`, fn)
                } else {
                    obj[`on${trigger}`] = fn
                }
            }
        }
    };
</script>

<style>
</style>