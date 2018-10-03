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
                type: String,
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

        },
        mounted() {
            this.formatOptions();
            let vm = this;
            console.log(vm);
            // let vm = this;
            // select.select2('refresh');
        },
        methods: {
            ...mapActions([
                'getProductList',
            ]),

            init() {
                let select = $(this.$el);
                console.log(select);
                select
                    .select2({
                        templateResult: this.formatState,
                        placeholder: 'Select',
                        width: '100%',
                        theme: 'default',
                        allowClear: true,
                        data: this.select2data
                    })
                    .on('change', () => {
                        this.$emit('input', select.val())
                    });
                select.val(this.value).trigger('change');
            },
            formatOptions() {
                // // this.select2data.push({id: '', text: 'Select'});
                // if (this.customData === 'products') {
                //
                // } else {
                //     for (let key in this.options) {
                //         this.select2data.push({id: key, text: this.options[key]})
                //     }
                // }
                // return new Promise((resolve, reject) => {
                //
                //     let parseData = JSON.parse(JSON.stringify(this.options));
                //     let normalData = Object.values(parseData);
                //     normalData.forEach((element) => {
                //         this.select2data.push({id: element.id, image: element.imageURL, text: element.name})
                //     });
                // });
                console.log(this.options);
                this.getProductList()
                    .then((val) => {
                        console.log(val);
                        let parseData = JSON.parse(JSON.stringify(val));
                        let normalData = Object.values(parseData);
                        normalData.forEach((element) => {
                            this.select2data.push({
                                key: element.key,
                                id: element.id,
                                image: element.imageURL,
                                text: element.name
                            })
                        });
                        this.init();
                        return this.select2data;
                    })
                    .then((select2Data) => {
                        console.log(select2Data);
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
            select2;
        },
        created() {
            this.getProductList();
        },
    }
</script>

<style lang="scss" scoped>

</style>