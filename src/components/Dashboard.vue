<template>
    <div class="mainLayout">
        <Navigation/>
        <router-view></router-view>
    </div>
</template>

<script>
    import Navigation from "@/components/navigation/Navigation.vue";

    export default {
        name: "dashboard",
        components: {
            Navigation
        },
        data() {
            return {};
        },
        watch: {},
        methods: {}
    };
</script>

<style scoped lang="scss">
    .mainLayout {
        min-height: calc(100vh - 56px);
    }
</style>