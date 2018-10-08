<template>
    <div class="orders">
        <div class='container'>
            <BaseButton classes="createOrder orders__btn orders__btn--showModal"
                        type="secondary"
                        @click="createOrdersHandler">
                Create New Order
            </BaseButton>

            <BaseTable classes="orders__table"
                       :responsive="table.isResponsive">
                <tr slot="tableHead">
                    <th v-for="(headName, index) in table.data.headNames" :key='index'>{{headName}}</th>
                </tr>
                <tr v-for="(order, index) in table.data.bodyContent" :key='order.id' slot="tableBody">
                    <td>{{ order.id }}</td>
                    <td>{{ order.date }}</td>
                    <td>
                        <ul class="orders__product-list productList">
                            <li v-for="product in products" :key='product.id' class="productList__item">{{ product.name
                                }} x {{ product.stock }}
                            </li>
                        </ul>
                    </td>
                    <td>{{ order.clientName }}</td>
                    <td>{{ order.phone }}</td>
                    <td>{{ order.total }}</td>
                    <td>{{ order.paid }}</td>
                    <td>{{ order.sent }}</td>
                    <td>
                        <div style="display: flex; align-items: center">
                            <BaseButton classes="orders__btn"
                                        type="info"
                                        icon="pencil"
                                        @click="editOrderHandler(order, index)"
                                        :circle="true">
                            </BaseButton>

                            <BaseButton classes="orders__btn"
                                        type="danger"
                                        icon="trash"
                                        :circle="true"
                                        @click="removeOrderHandler(index)">
                            </BaseButton>
                        </div>
                    </td>
                </tr>
            </BaseTable>

            <BaseModal
                    @close="closeModal"
                    classes="orders__modal"
                    :isVisible.sync="orderModal.isVisible"
                    :title="(orderModal.status === 'edit' ? 'Save changes' : orderModal.status === 'create' ? 'Create product' : null)">
                <div slot="modal-body">
                    <form autocomplete="off">
                        <input autocomplete="false" name="hidden" type="text" style="display:none;">
                        <div class="form-group ">
                            <div class="row">
                                <label class="col-sm-2 col-form-label">Product</label>
                                <transition-group name='bounce' tag='ul' class="productList col-sm-10">
                                    <li class='productList__item' v-for='(item, index) in orderModal.productList'
                                        :key='item + "__" + index'>
                                        <div class="input-group">
                                            <div class="input-group__select-wraper">
                                                <BaseSelect :options="products" classes="select2" customData="products"
                                                            :id="'baseSelect_' + index"
                                                            :name="'baseSelect_' + index"
                                                            :aria-describedby="'baseSelectHelp_' + index"
                                                            v-validate="'required'"
                                                            v-model="item.selected">
                                                </BaseSelect>
                                                <!--v-validate="{is_not: hasDuplicate(item)}"-->
                                                <!--:hasValidate="orderModal.confirmChangesBtn.isPressed"-->
                                                <small :id="'baseSelectHelp_'+ index" class="invalid-feedback"> {{
                                                    errors.first('baseSelect_'+ index)}}
                                                </small>
                                            </div>
                                            <div class="input-group-append">
                                                <input type="text"
                                                       placeholder="Count"
                                                       :class="{'form-control': true, 'is-invalid': errors.has('productCount_'+ index) }"
                                                       :name="'productCount_'+ index"
                                                       :aria-describedby="'productCountHelp_'+ index"
                                                       v-validate="'required|numeric|notZero'"
                                                       v-model="item.productCount">
                                                <!--<small :id="'productCountHelp_'+ index" class="invalid-feedback"> {{-->
                                                    <!--errors.first('productCount_'+ index)}}-->
                                                <!--</small>-->
                                            </div>
                                            <BaseButton classes="productList__removeBtn"
                                                        type="danger"
                                                        icon="trash"
                                                        :square="true"
                                                        :disabled="ordersProductsList < 2"
                                                        @click="removeProductWithOrdersProductListHandler(index)">
                                            </BaseButton>
                                        </div>
                                        <small :id="'productCountHelp_'+ index" class="invalid-feedback"> {{
                                            errors.first('productCount_'+ index)}}
                                        </small>
                                    </li>
                                </transition-group>
                            </div>
                            <div class="row">
                                <div class="col-sm-10 offset-sm-2 ">
                                    <BaseButton classes=""
                                                :block="true"
                                                :outline="true"
                                                type="info"
                                                :disabled="ordersProductsList >= Object.keys(this.products).length"
                                                @click="addProductInOrdersProductListHandler">
                                        Add One More Product
                                    </BaseButton>
                                </div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label" for="oreder_clientName">Client Name</label>
                            <div class="col-sm-10">
                                <input
                                        name="clientName" v-model="orderModal.inputFieldsValue.clientName"
                                        v-validate="'required|alpha_spaces'"
                                        :class="{'form-control': true, 'is-invalid': errors.has('clientName') }"
                                        id="oreder_clientName" type="text" placeholder="Name"
                                        aria-describedby="oreder_clientNameHelp">
                                <small id="oreder_clientNameHelp" class="invalid-feedback"> {{
                                    errors.first('clientName') }}
                                </small>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label" for="oreder_phone">Phone</label>
                            <div class="col-sm-10">
                                <input
                                        name="phone" v-model="orderModal.inputFieldsValue.phone"
                                        v-validate="'required|alpha_dash'"
                                        :class="{'form-control': true, 'is-invalid': errors.has('phone') }"
                                        id="oreder_phone" type="text" placeholder="(xxx) xx xx xxx"
                                        aria-describedby="oreder_phoneHelp">
                                <small id="oreder_phoneHelp" class="invalid-feedback"> {{ errors.first('phone') }}
                                </small>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-sm-10 offset-sm-2">
                                <ul class="checkboxList">
                                    <li class="checkboxList__item">
                                        <BaseCheckbox id='paidCheckbox'
                                                      name="paidCheckbox"
                                                      aria-describedby="paidCheckboxHelp"
                                                      :isMargin="false"
                                                      v-validate="'required|truthy'"
                                                      v-model="orderModal.inputFieldsValue.paidCheckbox">Paid
                                        </BaseCheckbox>
                                        <small id="paidCheckboxHelp" class="checkboxList__error invalid-feedback"> {{
                                            errors.first('paidCheckbox') }}
                                        </small>
                                    </li>
                                    <li class="checkboxList__item">
                                        <BaseCheckbox id='sentCheckbox'
                                                      name="sentCheckbox"
                                                      aria-describedby="sentCheckboxHelp"
                                                      :isMargin="false"
                                                      v-validate="'required|truthy'"
                                                      v-model="orderModal.inputFieldsValue.sentCheckbox">Sent
                                        </BaseCheckbox>
                                        <small id="sentCheckboxHelp" class="checkboxList__error invalid-feedback"> {{
                                            errors.first('sentCheckbox') }}
                                        </small>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>

                <div slot="modal-footer" class="btn-group">
                    <BaseButton type="primary"
                                :outline="true"
                                @click="closeModal">Cancel
                    </BaseButton>
                    <BaseButton type="secondary"
                                :outline="true"
                                :disabled="orderModal.confirmChangesBtn.isDisabled"
                                @click="onConfirm()"> Save
                    </BaseButton>
                </div>
            </BaseModal>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import VeeValidate from 'vee-validate';
    import {mapActions} from 'vuex';
    // import $ from 'jquery';
    // import select2 from 'select2';
    // import {cloneDeep} from "lodash";

    import BaseButton from '@/components/_shared/BaseButton';
    import BaseTable from '@/components/_shared/BaseTable';
    import BaseModal from '@/components/_shared/BaseModal';
    import BaseSelect from '@/components/_shared/BaseSelect';
    import BaseCheckbox from '@/components/_shared/BaseCheckbox';

    Vue.use(VeeValidate);
    // VeeValidate.Validator.extend('isDuplicate', {
    //     getMessage: field => 'The ' + field + ' value has duplicate fields.',
    //     validate(value, {obj}) {
    //         let duplicate;
    //         obj.map(v => v.selected)
    //             .sort()
    //             .sort((a, b) => {
    //                 return (a === b) ? duplicate = true : duplicate = false;
    //             });
    //         return duplicate;
    //     }
    // });
    VeeValidate.Validator.extend('truthy', {
        getMessage: field => 'The ' + field + ' value is not truthy.',
        validate: value => !!value
    });
    VeeValidate.Validator.extend('notZero', {
        getMessage: field => 'The ' + field + ' value must be more then 0',
        validate(value) {
            return value > 0
        }
    });

    export default {
        name: "Orders",
        components: {
            BaseButton,
            BaseTable,
            BaseModal,
            BaseSelect,
            BaseCheckbox,
        },
        data() {
            return {
                orderModal: {
                    isVisible: false,
                    confirmChangesBtn: {
                        isDisabled: false,
                        // isPressed: false,
                    },
                    status: '',
                    inputFieldsValue: {},
                    productList: [{}],
                },
                table: {
                    isResponsive: true,
                    data: {
                        headNames: ['id', 'Date', 'Products', 'Client Name', 'Phone', 'Total', 'Paid', 'Sent', 'Actions'],
                        bodyContent: [
                            {
                                id: 1,
                                date: '2025-04-01',
                                clientName: 'Belibov Nikolay',
                                phone: '(067) 12 34 567',
                                total: '2340,00',
                                paid: true,
                                sent: false
                            },
                        ],

                    }
                },
            }
        },
        // watch: {
        //     products() {
        //         // this.$refs.baseselect = this.products;
        //         // console.log(this.$refs.baseselect.$options.propsData.options = this.products);
        //         this.$refs.baseselect.options = this.products;
        //     }
        // },
        mounted() {
        },
        computed: {
            products() {
                return this.$store.state.products;
            },
            ordersProductsList() {
                let items = this.orderModal.productList;
                return items.length
            },

        },
        methods: {
            ...mapActions([
                'getProductList',
            ]),
            // ОТКРыВАНИЕ МОДАЛЬНыХ ОКОН
            /**
             * Открывает модальное окно создания ордера
             *
             */
            createOrdersHandler() {
                let orderModal = this.orderModal;
                orderModal.status = 'create';
                orderModal.isVisible = true;
                console.log(this.products);
            },
            editOrderHandler() {

            },
            removeOrderHandler() {

            },

            addProductInOrdersProductListHandler() {
                let items = this.orderModal.productList;
                items.push({});
            },
            removeProductWithOrdersProductListHandler(index) {
                console.log(index);
                let items = this.orderModal.productList;
                items.splice(index, 1);
            },

            closeModal() {
                let orderModal = this.orderModal;

                orderModal.isVisible = false;
                orderModal.confirmChangesBtn.isDisabled = false;
                orderModal.confirmChangesBtn.isPressed = false;
                orderModal.inputFieldsValue = {};
                orderModal.productList = [{}];
                orderModal.status = '';
            },
            hasDuplicate(values) {
                console.log(values);
                let isDuplicate;
                values
                    .map(v => v.selected)
                    .sort()
                    .sort((a, b) => {
                        return (a === b) ? isDuplicate = true : isDuplicate = false;
                    });
                console.log(isDuplicate);
                return isDuplicate;
            },
            onConfirm() {
                this.orderModal.confirmChangesBtn.isPressed = true;
                this.$validator.validateAll()
                    .then((response, reject) => {
                        if (this.hasDuplicate(this.orderModal.productList) === true || this.errors.items.length !== 0) {
                            console.log(this.errors.items.length);
                            reject;
                        } else {
                            console.log(response);
                            response;
                        }
                        // if(this.errors.items.length === 0) {
                        //     console.log(response);
                        //     response;
                        // } else {
                        //     console.log(this.errors.items.length);
                        //     // let isDuplicate;
                        //     // this.orderModal.productList
                        //     //     .map(v => v.selected)
                        //     //     .sort()
                        //     //     .sort((a, b) => {
                        //     //         return (a === b) ? isDuplicate = true : isDuplicate = false;
                        //     //     });
                        //     // console.log(isDuplicate);
                        //     this.hasDuplicate(this.orderModal.productList);
                        //     reject;
                        // }
                    });
            }

        },
        created() {
            this.getProductList();
        },
    }
</script>

<style scoped lang="scss">
    .orders {
        margin-top: 56px;
        padding-top: 50px;
        &__btn {
            &--showModal {
                margin-bottom: 30px;
            }
        }
        &__btn + &__btn {
            margin: rem(5);
        }
    }

    .btn.square {
        @include is-circle(38, 1);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border-radius: 0;
        > .oi {
            left: 1px;
            top: initial;
        }
    }

    .modal {
        .input-group {
            display: flex;
            flex-wrap: nowrap;
            input {
                border-radius: 0;
            }

            .input-group-append {
                flex-wrap: wrap;
                flex-shrink: 0;
                width: rem(100);
                z-index: 1;
            }
        }
        .input-group {

            & /deep/ [aria-invalid="true"] {
                &[hasvalidate="true"] ~ .select2 .select2-selection.select2-selection--single {
                    border-color: $red;
                }
            }
            & /deep/ .select2-container {
                &.select2-container--default {
                    .select2-selection--single {
                        width: 100%;
                        height: calc(2.25rem + 2px);
                        padding: 0.375rem rem(20) 0.375rem 0.75rem;
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
                            height: 2.25rem;
                        }
                    }
                }
            }

            &__select-wraper {
                width: calc(100% - 138px);
            }
        }
    }

    .select {
        width: 100%;
    }

    @media (min-width: map-get($grid-breakpoints, "sm")) {
        .select {
            width: calc(100% - 138px) !important;
        }
    }

    .productList {
        &__item {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
        }
        &__item + &__item {
            margin-top: rem(5);
        }
    }

    .checkboxList {
        list-style: none;
        padding: 0;
        margin: 0;
        &__item {
            display: flex;
            flex-direction: column;
            align-items: baseline;
        }

        &__item + &__item {
            margin-top: rem(8);
        }
    }
</style>