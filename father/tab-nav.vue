<template>
    <div class="page-tab">
        <ul class="tab-nav">
            <li class="nav-item"
                @click.stop="fnChangeItem(item, index)"
                v-for="(item, index) in data"
                :key="index">
                <slot></slot>
                <div class="nav-icon" :class="{active: item.name === curSelected}">
                    <Icon :type="item.icon" :className="item.iconClass" v-if="item.icon || item.iconClass"
                          :class="{active: item.name === curSelected}"></Icon>
                    <span v-if="item.text" class="nav-icon-text">{{item.text}}</span>
                </div>
                <span class="nav-line"></span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'tab-nav',
        props: {
            data: Array,
            iframeName: String
        },
        data() {
            return {
                paymentNav: [],
                curSelected: '',
                show: true
            };
        },
        watch: {
            $route(val) {
                this.curSelected = val && val.name;
            }
        },
        mounted() {
            this.curSelected = this.$route.name
        },
        methods: {
            // 导航切换
            fnChangeItem(item, index) {
                this.$router.push({name: item.name});
                this.$emit('onChange');
            }
        }
    };
</script>

<style scoped>
</style>