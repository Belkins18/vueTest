<template>
    <select class="custom-select"
            :class="{
                [`${classes}`]: classes,
            }"
            :customData="customData"
            :name="name"
            :multiple="multiple">
    </select>
</template>

<script>
    import {mapActions} from 'vuex';
    import $ from 'jquery';
    // eslint-disable-next-line
    import select2 from 'select2';

    export default {
        name: "BaseSelect",
        props: {
            name: '',
            options: {
                Object
            },
            value: null,
            customData: {
                type: String,
                default: ''
            },
            classes: {
                type: String | [],
                default: ''
            },
            multiple: {
                Boolean,
                default: false
            }
        },
        data() {
            return {
                select2data: [],
                newData: []
            }
        },
        computed: {
            products() {
                return this.$store.state.products;
            },
            vm() {
                return this;
            }
        },
        mounted() {
            this.formatOptions(this.products, this.select2data);
            this.init(this.select2data);
        },
        watch: {
            value: function (value) {
                let select = $(this.$el);

                select.val(value).trigger('change');
                select.removeClass('is-invalid');
            },

            options: function (options) {
                let select = $(this.$el);
                this.formatOptions(options, this.newData);

                select.select2({
                        templateResult: this.formatState,
                        data: this.newData,
                        placeholder: 'Select',
                        width: '100%',
                        theme: 'default',
                        allowClear: this.clear !== '' ? this.clear : false
                    })
                    .val(this.value)
                    .trigger('change');
            }
        },
        methods: {
            ...mapActions([
                'getProductList',
            ]),

            init(data) {
                let select = $(this.$el);

                select.select2({
                        templateResult: this.formatState,
                        data: data,
                        placeholder: 'Select',
                        width: '100%',
                        theme: 'default',
                        allowClear: this.clear !== '' ? this.clear : false
                    })
                    .val(this.value)
                    .trigger('change')
                    .on('change', () => {
                        this.$emit('input', select.val())
                    });
            },
            formatOptions(options, newData) {
                let parseData = JSON.parse(JSON.stringify(options));
                let normalData = Object.values(parseData);
                normalData.forEach((element) => {
                    newData.push({
                        key: element.key,
                        id: element.id,
                        image: element.imageURL,
                        text: element.name,
                        stock: element.stock,
                        price: element.price
                    })
                });
            },
            formatState(state) {
                if (!state.id) {
                    return state.text;
                }

                return (!state.image)
                    ? ($(`<span>${state.text}</span>`))
                    : ($(`
                        <div style="display: flex; align-items: center;">
                            <span style="display: flex; align-items: center; justify-content: center;">
                                <img src=${state.image} class="select__img" width="30px" />
                            </span>
                            <span style="margin-left: 5px">${state.text}<span style="margin-left: 5px; color: #ced4da;">(${state.stock})</span></span>
                        </div>
                        `));
            }
        },
        destroyed() {
            $(this.$el).off().select2('destroy');
        },
        created() {
            this.getProductList();
        },
    }
</script>

<style lang="scss" scoped>
    .custom-select {
        display: none;
        ~ {
            & /deep/ .select2-container {
                &.select2-container--default {
                    .select2-selection--single {
                        width: 100%;
                        display: inline-flex;
                        align-items: center;
                        height: rem(38);
                        padding: 0 rem(20) 0 rem(10);
                        font-size: 1rem;
                        line-height: 1.5;
                        color: $gray-700;
                        background-color: #fff;
                        background-clip: padding-box;
                        border: 1px solid $gray-400;
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                        .select2-selection__placeholder {
                            color: $gray-400;
                        }
                        .select2-selection__rendered {
                            padding: 0;
                        }
                        .select2-selection__arrow {
                            height: rem(36);
                            top: rem(1);
                            right: rem(1);
                        }
                    }
                }
            }
        }
    }

    .custom-select.is-invalid ~ {
        & /deep/ .select2-container {
            &.select2-container--default {
                .select2-selection--single {
                    position: relative;
                    border-color: $red;
                    z-index: 2;

                    .select2-selection__arrow {
                        height: rem(36);
                        top: rem(0);
                        right: rem(0);
                    }
                }
            }
        }
    }
</style>