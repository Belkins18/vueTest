<template>
    <form class="card shadow-sm" @submit.prevent="enterUser">
        <div class="card-header">
            <h4 class="my-0 font-weight-normal">Login to MyStock</h4>
        </div>
        <div class="card-body">
            <div class="row align-items-center">
                <div class="col">
                    <label for="signIn_email">Email</label>
                </div>
                <div class="col-sm-9">
                    <input id="signIn_email" name="signIn_email" type="email" class="form-control"
                           :class="{'is-invalid': signError && code==='auth/user-not-found'}"
                           placeholder="Input to email:" required
                           @change="change()"
                           v-model="user.email">
                </div>
            </div>
            <div class="row align-items-center mt-4">
                <div class="col">
                    <label for="signIn_password">Password</label>
                </div>
                <div class="col-sm-9">
                    <input id="signIn_password" name="signIn_password" type="password" class="form-control"
                           :class="{'is-invalid': signError && code==='auth/wrong-password'}"
                           placeholder="Input to password:"
                           required
                           @change="change()"
                           v-model="user.password">
                </div>
            </div>
            <div v-if='signError' class="col-sm-9 mt-2">
                <div class="signError">
                    <div class="invalid-feedback">{{message}}</div>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <div class="row align-items-center justify-content-center">
                <div class="col-4">
                    <BaseButton :nativeType="'submit'" type="primary" block="true" outline="true">Sign In</BaseButton>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
    import BaseButton from "@/components/_shared/BaseButton";
    export default {
        name: "signIn",
        components: {
            BaseButton
        },
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
        watch: {},
        methods: {
            change() {
                this.signError = false;
            },
            enterUser() {
                this.$store.dispatch('userAuth', this.user)
                    .then(() => {
                        this.$router.push({path: '/'});
                    })
                    .catch((error) => {
                        this.signError = true;
                        this.code = error.code;
                        this.message = error.message;
                        console.log(error);
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

    .signError {
        .invalid-feedback {
            display: block;
        }
    }
</style>