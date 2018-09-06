<template>
    <div class="flight">
        <travel-iframe :iframeLink="iframeLink"></travel-iframe>
    </div>
</template>

<script>
    import TravelIframe from '../../../components/iframe';
    import { PATH } from '../../../utils/constants'

    export default {
        components: {TravelIframe},
        data() {
            return {
                iframeLink: PATH.FLIGHT
            };
        }
    };
</script>

<style>
</style>