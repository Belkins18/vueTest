<template>
    <div class="mainLayout">
        <Navigation/>
        <BaseLoading v-if="pending"/>
        <router-view></router-view>
    </div>
</template>

<script>
    import Navigation from "@/components/navigation/Navigation";
    import BaseLoading from "@/components/_shared/BaseLoading";

    export default {
        name: "Dashboard",
        components: {
            Navigation,
            BaseLoading
        },
        data() {
            return {};
        },
        computed: {
            pending() {
                return this.$store.state.pending;
            },
        },
        watch: {},
        methods: {}
    };
</script>

<style scoped lang="scss">
    .mainLayout {
        min-height: calc(100vh - 64px);
    }
</style>