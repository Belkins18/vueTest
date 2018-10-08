<template>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
        <div class="container">
            <router-link class="navbar-brand" to="/">My Stock</router-link>
            <Hamburger/>
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link class="nav-link" :to="{ name: PageNames.PRODUCTS }">Products</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" :to="{ name: PageNames.ORDERS }">Orders</router-link>
                    </li>
                </ul>
                <div class="navbar-nav navbar-nav__logout ml-auto">
                    <div class="nav-item">
                        <a href="#" class="nav-link" @click.prevent="onLogout">LogOut</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
    import Hamburger from '@/components/navigation/Hamburger';
    import PageNames from '../../configs/pageNames';

    export default {
        name: "Navigation",
        components: {
            Hamburger
        },
        data() {
            return {
                // productPage: PageNames.PRODUCTS,
                // orderPage: PageNames.ORDERS,
                // signInPage: PageNames.SIGN_IN
            };
        },
        // FIXME: Альтернативный вариант, не значит что это плохой
        created() {
            this.PageNames = { ...PageNames  };
        },
        watch: {},
        methods: {
            onLogout() {
                this.$store.dispatch('onLogout');
                this.$router.push('/signIn');
            }
        }
    }
</script>

<style scoped lang="scss">
    .navbar {
        box-shadow: $el-box-shadow;
    }

    .nav-link {
        &.router-link-exact-active.router-link-active {
            color: $teal;
        }
    }

    .fixed-top {
        background: #FFFFFF;
    }
</style>