<template>
    <label class="checkbox" :class="{[`checkbox_block`]: isBlock, [`checkbox_margin`]: isMargin}">
        <input class="checkbox__input"
               type="checkbox"
               :id="id"
               :checked="value"
               @change="$emit('input', $event.target.checked)">
        <span class="checkbox__label" :class="{[`is-checked`]: value}">
            <i class="checkbox__button"></i>
            <span class="checkbox__text" v-if="$slots.default || text">
                    <slot></slot>
                    <template v-if="!$slots.default">{{text}}</template>
            </span>
        </span>
    </label>
</template>

<script>
    export default {
        name: "BaseCheckbox",
        props: {
            id: {
                type: String,
                default: 'checkbox'
            },
            isBlock: {
                type: Boolean,
                default: false
            },
            isMargin: {
                type: Boolean,
                default: true
            },
            value: Boolean
        },
    }
</script>

<style scoped lang="scss">
    .checkbox {
        position: relative;
        display: inline-flex;
        margin-bottom: 0;
        &__input {
            display: none;
        }
        &__label {
            cursor: pointer;
            display: flex;
            line-height: 1.2;
            > * + * {
                margin-left: rem(5);
            }
        }
        &__text{
            padding-top: rem(1);
        }
        &__button {
            position: relative;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            display: inline-flex;
            color: $gray-400;
            left: 0;
            top: 0;
            width: 20px;
            height: 20px;
            z-index: 0;
            border: 1px solid currentColor;
            border-radius: 0;
            transition: color 0.28s ease;
            will-change: color;
            background: $white;
            &::before, &::after {
                position: absolute;
                height: 0;
                width: 3px;
                background-color: $black;
                display: block;
                transform-origin: left top;
                border-radius: 0.25rem;
                content: "";
                transition: opacity 0.28s ease, height 0s linear 0.28s;
                opacity: 0;
                will-change: opacity, height;
            }
            &::before {
                top: 15px;
                left: 8px;
                transform: rotate(-135deg);
                box-shadow: 0 0 0 0.0625rem $white;
            }
            &::after {
                top: 8px;
                left: 1px;
                transform: rotate(-45deg);
            }
        }
    }

    .is-checked {
        .checkbox__button {
            color: $gray-700;
            &::after, &::before {
                opacity: 1;
                transition: height 0.28s ease;
            }
            &::after {
                height: 0.5rem;
            }
            &::before {
                height: 1.2rem;
                transition-delay: 0.28s;
            }
        }
    }

    .checkbox {
        &_block {
            display: flex;
        }
        &_margin {
            margin-bottom: 0.5rem;
        }
    }

</style>