<template>
    <form class="card shadow-sm" @submit.prevent="enterUser">
        <div class="card-header">
            <h4 class="my-0 font-weight-normal">Login to MyStock</h4>
        </div>
        <div class="card-body">
            <div class="row align-items-center">
                <div class="col">
                    <!-- FIXME: значение в for должно совпадать c ID а не с name -->
                    <label for="signIn_email">Email</label>
                </div>
                <div class="col-sm-9">
                    <input name="signIn_email" type="email" class="form-control" placeholder="Input to email:" required
                           v-model="user.email">
                </div>
            </div>
            <div class="row align-items-center mt-4">
                <div class="col">
                    <!-- FIXME: значение в for должно совпадать c ID а не с name -->
                    <label for="signIn_password">Password</label>
                </div>
                <div class="col-sm-9">
                    <input name="signIn_password" type="password" class="form-control" placeholder="Input to password:"
                           required
                           v-model="user.password">
                </div>
                <div v-show='signError'>
                    <div class="invalid-feedback">Error code: {{code}}</div>
                    <div class="invalid-feedback">Error message: {{message}}</div>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <div class="col-4">
                <button type="submit" class="btn btn-lg btn-block btn-outline-primary">Sign In</button>
            </div>
        </div>
    </form>
</template>

<script>
    export default {
        name: "signIn",
        data() {
            return {
                user: {
                    email: '',
                    password: ''
                },
                signError: false,
                code: '',
                message: ''
            }
        },
        methods: {
            enterUser() {
                this.$store.dispatch('userAuth', this.user)
                    .then(() => {
                        this.$router.push({ path: '/' });
                    });
            }
        },
    }
</script>

<style scoped lang="scss">
    .card {
        box-shadow: $el-box-shadow !important;
    }
    @media (min-width: map-get($grid-breakpoints, "sm")) {
        .card {
            position: absolute;
            width: $modal-md;
            margin: 0;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
        }
    }
</style>