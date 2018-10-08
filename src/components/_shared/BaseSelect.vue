<template>
    <select class="form-control"
            :class="{
                [`${classes}`]: classes,
            }"
            :customData="customData"
            :name="name"
            :multiple="multiple"></select>
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
                select2data: []
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
            this.formatOptions();
            this.init(this.select2data);
        },
        watch: {
            value: function (value) {
                $(this.$el).val(value).trigger('change');
            },

            options: function (options) {
                let select = $(this.$el);
                select
                    .select2({
                        data: options,
                        placeholder: 'Select',
                        width: '100%',
                        theme: 'default',
                        allowClear: this.clear !== '' ? this.clear : false
                        })
                    .val(this.value)
                    .trigger('change')
                
            }
        },
        methods: {
            ...mapActions([
                'getProductList',
            ]),

            init(data) {
                let select = $(this.$el);
                select
                    .select2({
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
            formatOptions() {
                let parseData = JSON.parse(JSON.stringify(this.products));
                let normalData = Object.values(parseData);
                normalData.forEach((element) => {
                    this.select2data.push({
                        key: element.key,
                        id: element.id,
                        image: element.imageURL,
                        text: element.name
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
                            <span style="margin-left: 5px">${state.text}</span>
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

    .select2-container--default .select2-selection--single .select2-selection__rendered {
        line-height: 1.5;
    }
</style>