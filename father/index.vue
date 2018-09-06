<template>
    <div class="travel-page">
        <!---->
        <div class="travel-page-top" v-show="!hideBanner">
            <!-- 轮播图 -->
            <swiper-banner :data="banners" v-if="banners && banners.length"></swiper-banner>
            <!-- tab切换 -->
            <tab-nav :data="pageText.tabNav"></tab-nav>
        </div>
        <!-- 子页面：不同业务对应的具体内容-->
        <router-view class="components"></router-view>
    </div>
</template>

<script>
    import SwiperBanner from '../../components/swiper'
    import TabNav from '../../components/TabNav'
    import {Tab, TabItem} from '../../components/Tab/index'
    import api from '../../api'

    export default {
        name: 'TravelCategory',
        components: {TabNav, SwiperBanner, Tab, TabItem},
        data() {
            return {
                banners: []
            };
        },
        created() {
            this.fnGetFlightAd();
            this.$store.commit('setTitle', 'Travel')
        },
        computed: {
            hideBanner() {
                return this.pageTitle !== this.$route.meta.title
            },
            pageTitle () {
                console.log('store 状态修改', this.$store)
                return this.$store.state.pageTitle
            }
        },
        methods: {
            fnGetFlightAd() {
                api.getAdvImage('CarouselLayout', 'Travel_M').then(res => {
                    this.banners = res.data || []
                })
            }
        }
    };
</script>

<style scoped>
</style>
