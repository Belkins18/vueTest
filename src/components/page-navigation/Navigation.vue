<template>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
        <div class="container">
            <router-link class="navbar-brand" to="/">My Stock</router-link>
            <Hamburger/>
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <!-- FIXME: у тебя же есть файл с константами где хранятся имена страниц, это хорошее место чтобы их юзать, например
                             <router-link class="nav-link" :to="{ name: productPage }">Products</router-link>
                             а в date сделать что-то вроде date() { return { productPage: PageNames.PRODUCTS } }
                             либо сделать а-ля константу в created, created() { this.pageNames = { ...PageNames }; }
                        -->
                        <router-link class="nav-link" :to="{ name: productPage }">Products</router-link>
                        <!--<router-link class="nav-link" to="products">Products</router-link>-->
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" :to="{ name: orderPage }">Orders</router-link>
                    </li>
                    <!-- FIXME: Стоит вынести в сторону чтобы случайно не нажать при переходе между страницами -->
                    <li class="nav-item">
                        <a href="#" class="nav-link" @click.prevent="logout">LogOut</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
    import Hamburger from '@/components/page-navigation/Hamburger.vue';
    import PageNames from '../../pageNames';

    export default {
        name: "Navigation",
        components: {
            Hamburger
        },
        data() {
            return {
                productPage: PageNames.PRODUCTS,
                orderPage: PageNames.ORDERS,
                signInPage: PageNames.SIGN_IN
            };
        },

        watch: {},
        methods: {
            logout() {
                this.$store.dispatch('logout');
            }
        }
    }
</script>

<style scoped lang="scss">
    .navbar{
        box-shadow: $el-box-shadow;
    }

    .fixed-top {
        background: #FFFFFF;
    }
</style>