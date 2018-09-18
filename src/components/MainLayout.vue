<template>
    <div class="mainLayout">
        <Navigation/>
        <router-view></router-view>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Navigation from "@/components/page-navigation/Navigation.vue";

    export default {
        name: "mainLayout",
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