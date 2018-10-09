<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        created() {
            this.$store.dispatch('initFirebase');
        },
        watch: {},
        methods: {}
    };
</script>

<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;
        a {
            font-weight: bold;
            color: #2c3e50;
            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
    .select2-container--default .select2-results__option {
        font-size: rem(12);
    }
    .select2-container--default .select2-results__option[aria-selected=true] {
        background-color: rgba($cyan, 0.7);
        color: $gray-100;
    }

    .invalid-feedback {
        font-size: rem(12);
    }

    * {
        outline: none !important;
        box-sizing: border-box;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */
    {
        opacity: 0;
    }
</style>


