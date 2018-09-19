<template>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
        <div class="container">
            <router-link class="navbar-brand" to="/">My Stock</router-link>
            <Hamburger/>
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav ml-auto">
                    <!--<li class="nav-item">-->
                        <!--<router-link class="nav-link" to="home">Home</router-link>-->
                    <!--</li>-->
                    <li class="nav-item">
                        <!-- FIXME: у тебя же есть файл с константами где хранятся имена страниц, это хорошее место чтобы их юзать, например
                             <router-link class="nav-link" :to="{ name: productPage }">Products</router-link>
                             а в date сделать что-то вроде date() { return { productPage: PageNames.PRODUCTS } }
                             либо сделать а-ля константу в created, created() { this.pageNames = { ...PageNames }; }
                        -->
                        <router-link class="nav-link" to="products">Products</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="orders">Orders</router-link>
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
    import Hamburger from '@/components/page-navigation/Hamburger.vue'
    export default {
        name: "Navigation",
        components: {
            Hamburger
        },
        data() {
            return {};
        },

        watch: {},
        methods: {
            logout() {
                this.$store.dispatch('logout');

                // FIXME: Вполне можно перенести в action, к тому же опять место где стоит юзать данные из файла PageNames
                this.$router.push({path: 'signIn'});
            }
        },
        // beforeMount() {
        //     console.log(`beforeMount`);
        //     console.log(`status: ${this.$store.state.isLoggedIn}`);
        //     return new Promise((resolve) => {
        //         if (this.$store.state.isLoggedIn === false) {
        //             this.$router.push({ path: 'signIn' });
        //             resolve();
        //         }
        //     })
        // },
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