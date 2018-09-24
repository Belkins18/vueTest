<template>
    <button class="btn"
            @click="handleClick"
            :disabled="buttonDisabled"
            :type="nativeType"
            :class="[
                classes ? `${classes}`: '',
                type ? `btn-${type}` : '',                    // type: String,
                size ? `btn-${size}` : '',                    // type: String,
                outline ? `btn-outline-${type}` : '',         // type: Boolean,
                block ? 'btn-block' : '',                     // type: Boolean,
                {
                    'active': isActive,
                    'disabled': buttonDisabled,
                    'round': round,
                    'circle': circle
                }
            ]"
    >
        <span class="oi" :class="[icon ? `oi-${icon}` : '']" v-if="icon"></span>
        <span v-if="$slots.default"><slot></slot></span>
    </button>
</template>

<script>
    export default {
        name: "Button",
        props: {
            type: {
                /*
                    primary -> btn-primary
                    secondary -> btn-secondary
                    success -> btn-success
                    danger -> btn-danger
                    warning -> btn-warning
                    info -> btn-info
                    light -> btn-light
                    dark -> btn-dark

                    link -> btn-link
                */
                type: String,
                default: ''
            },
            size: {
                /*
                    larger or smaller buttons
                    -lg
                    -sm
                 */
                type: String,
                default: 'default'
            },
            classes: {
                type: String,
                default: ''
            },
            block: {
                type: Boolean,
                default: false
            },
            outline: {
                type: Boolean,
                default: false
            },
            icon: {
                type: String,
                default: ''
            },
            nativeType: {
                type: String,
                default: 'button'
            },
            isActive: Boolean,
            disabled: Boolean,
            round: Boolean,
            circle: Boolean,
        },
        computed: {
            buttonDisabled() {
                return this.disabled;
            }
        },
        methods: {
            handleClick(evt) {
                this.$emit('click', evt);
            }
        }
    }
</script>

<style scoped lang="scss">
    .btn {
        &.circle {
            position: relative;
            @include is-circle(36, 1);
            .oi {
                position: relative;
                display: flex;
                width: 100%;
                height: 100%;
                &:before {

                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
        }
    }
</style>