<template>
    <div class="checkbox" :class="{[`${classes}`]: classes}" @click="handleClick">
        <input class="checkbox__input"  :id="id" type="checkbox" :checked="checked"/>
        <label class="checkbox__label" :for="id">
            <span class="checkbox__text">{{text}}</span>
        </label>
        <i class="checkbox__button"></i>
    </div>
</template>

<script>
    export default {
        name: "BaseCheckbox",
        props: {
            text: {
                type: String,
                default: ''
            },
            classes: {
                type: String,
                default: ''
            },
            id: {
                type: String,
                default: 'checkbox'
            },
            checked: Boolean,
        },
        // data() {
        //     return {
        //         checked: false
        //     }
        // },
        // computed: {
        //    checkToogle() {
        //        return !this.checked;
        //    }
        // },
        methods: {
            handleClick(evt) {
                console.log(evt.target.checked);
                // this.$emit('click', evt);
            }
        }
    }
</script>

<style scoped lang="scss">
    .checkbox {
        position: relative;
        display: inline-flex;

        &__input {
            display: none;
        }
        &__input + label {
            cursor: pointer;
            position: relative;
            margin: 0;
            padding-left: 28px;
            font-size: 16px;
            font-weight: 500;
            line-height: 20px;
            letter-spacing: normal;
            text-transform: none;
            transition: 0.3s ease all;
            z-index: 1;
        }

        &__input:checked
        + &__label
        ~ &__button {
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

        &__button {
            position: absolute;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            display: block;
            color: $gray-400;
            left: 0;
            top: 0;
            width: 18px;
            height: 18px;
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
</style>