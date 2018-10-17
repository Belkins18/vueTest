<template>
    <button class="btn"
            @click="handleClick"
            :disabled="buttonDisabled"
            :type="nativeType"
            :class="{
                [`${classes}`]: classes,
                [`btn-${type}`]: type,
                [`btn-${size}`]: size,
                [`btn-outline-${type}`]: outline,
                ['btn-block']: block,
                active: isActive,
                disabled: buttonDisabled,
                round: round,
                circle: circle,
                square: square,
            }">
        <span class="oi" :class="[icon ? `oi-${icon}` : '']" v-if="icon"></span>
        <span v-if="$slots.default"><slot></slot></span>
    </button>
</template>

<script>
    export default {
        name: "BaseButton",
        props: {
            type: {
                // 'primary',      // -> btn-primary
                // 'secondary',    // -> btn-secondary
                // 'success',      // -> btn-success
                // 'danger',       // -> btn-danger
                // 'warning',      // -> btn-warning
                // 'info',         // -> btn-info
                // 'light',        // -> btn-light
                // 'dark',         // -> btn-dark
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
                default: ''
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
            square: Boolean,
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
        span{
            display: inline-flex;
        }
    }
    .btn.circle {
        @include is-circle(36, 1);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    .btn.circle > .oi {
        left: 1px;
        top: initial;
    }
/*
    .btn.circle > .oi {
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
*/
</style>