<template>
    <div class="mainLayout">
        <Navigation/>
        <router-view></router-view>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Navigation from "@/components/Navigation.vue";

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
        min-height: 100vh;
    }
</style>