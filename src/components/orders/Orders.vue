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
                <tr v-for="(order, index) in orders" :key='order.id' slot="tableBody">
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
                    <td>{{ order.checkboxPaid }}</td>
                    <td>{{ order.checkboxSent }}</td>
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
                    :title="(orderModal.status === 'edit' ? 'Edit order' : orderModal.status === 'create' ? 'Create order' : null)">
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
                                                <BaseSelect :options="products"
                                                            :class="{'hasError': errors.has('baseSelect_'+ index) }"
                                                            :id="'baseSelect_' + index"
                                                            :name="'baseSelect_' + index"
                                                            :aria-describedby="'baseSelectHelp_' + index"
                                                            customData="products"
                                                            v-validate="'required'"
                                                            v-model="item.selected">
                                                </BaseSelect>
                                                <small :id="'baseSelectHelp_'+ index" class="invalid-feedback">{{
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
                                            </div>
                                            <BaseButton classes="productList__removeBtn"
                                                        type="danger"
                                                        icon="trash"
                                                        :square="true"
                                                        :disabled="ordersProductsList < 2"
                                                        @click="removeProductWithOrdersProductListHandler(index)">
                                            </BaseButton>
                                        </div>
                                        <small class="invalid-feedback"> {{ errors.first('productCount_'+ index) }}
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
                                        name="clientName" v-model="orderModal.formFields.clientName"
                                        v-validate="'required|alpha_spaces'"
                                        :class="{'form-control': true, 'is-invalid': errors.has('clientName') }"
                                        id="oreder_clientName" type="text" placeholder="Name">
                                <small class="invalid-feedback"> {{ errors.first('clientName') }}</small>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label" for="oreder_phone">Phone</label>
                            <div class="col-sm-10">
                                <MaskedInput v-model="orderModal.formFields.phone"
                                             name="phone"
                                             mask="\+\8 (111) 111-1111"
                                             :class="{'is-invalid': errors.has('phone')}"
                                             class="form-control"
                                             v-validate:phoneNumber="'min:12'"
                                             placeholder-char="_"
                                             placeholder="Phone number"
                                             id="oreder_phone"
                                             type="tel">
                                </MaskedInput>
                                <small class="invalid-feedback"> {{ errors.first('phone') }}</small>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-sm-10 offset-sm-2">
                                <ul class="checkboxList">
                                    <li class="checkboxList__item">
                                        <BaseCheckbox id='checkboxPaid'
                                                      name="checkboxPaid"
                                                      aria-describedby="checkboxPaidHelp"
                                                      :isMargin="false"
                                                      v-model="orderModal.formFields.checkboxPaid">Paid
                                        </BaseCheckbox>
                                        <small id="checkboxPaidHelp" class="checkboxList__error invalid-feedback"> {{
                                            errors.first('checkboxPaid') }}
                                        </small>
                                    </li>
                                    <li class="checkboxList__item">
                                        <BaseCheckbox id='checkboxSent'
                                                      name="checkboxSent"
                                                      aria-describedby="checkboxSentHelp"
                                                      :isMargin="false"
                                                      v-model="orderModal.formFields.checkboxSent">Sent
                                        </BaseCheckbox>
                                        <small id="checkboxSentHelp" class="checkboxList__error invalid-feedback"> {{
                                            errors.first('checkboxSent') }}
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
                                @click="onConfirm()"> Accept
                    </BaseButton>
                </div>
            </BaseModal>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import VeeValidate from 'vee-validate';
    import MaskedInput from 'vue-masked-input'
    import {mapActions} from 'vuex';
    import {cloneDeep} from "lodash";

    import BaseButton from '@/components/_shared/BaseButton';
    import BaseTable from '@/components/_shared/BaseTable';
    import BaseModal from '@/components/_shared/BaseModal';
    import BaseSelect from '@/components/_shared/BaseSelect';
    import BaseCheckbox from '@/components/_shared/BaseCheckbox';

    Vue.use(VeeValidate);
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
    VeeValidate.Validator.extend('isBigger', (value, [otherValue]) => {
        return value > otherValue;
    }, {
        hasTarget: true
    });
    VeeValidate.Validator.extend('isSmaller', (value, [otherValue]) => {
        return value < otherValue;
    }, {
        hasTarget: true
    });

    export default {
        name: "Orders",
        components: {
            BaseButton,
            BaseTable,
            BaseModal,
            BaseSelect,
            BaseCheckbox,
            MaskedInput
        },
        data() {
            return {
                orderModal: {
                    data: {},
                    isVisible: false,
                    confirmChangesBtn: {
                        isDisabled: false,
                    },
                    status: '',
                    formFields: {
                        id: '',
                        key: '',
                        clientName: '',
                        phone: '',
                        checkboxPaid: false,
                        checkboxSent: false
                    },
                    productList: [],
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
            orders() {
                return this.$store.state.orders;
            },
            ordersProductsList() {
                let items = this.orderModal.productList;
                return items.length
            },
            phoneNumber() {
                if (this.orderModal.formFields.phone) {
                    return this.orderModal.formFields.phone.replace(/[^0-9a-zA-Z+]/g, '')
                }
            },
        },
        methods: {
            ...mapActions([
                'createOrder',
                'editOrder',
                'getProductList',
                'getOrderList',
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
                orderModal.productList = [{}];
                this.$set(orderModal.productList, 'id', '1');

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
                let formFields = this.orderModal.formFields;

                orderModal.isVisible = false;
                orderModal.confirmChangesBtn.isDisabled = false;
                orderModal.productList = [{}];
                orderModal.status = '';
                orderModal.data = {};

                formFields.id = '';
                formFields.key = '';
                formFields.clientName = '';
                formFields.phone = '';
                formFields.checkboxPaid = false;
                formFields.checkboxSent = false;
            },


            getKeyInDBPath(path) {
                let routePath = `/${this.$route.name}/`;
                let startnum = path.indexOf(routePath) + routePath.length;
                let key = path.slice(startnum, path.length);

                return key;
            },
            getProductCalcAttribute(products) {
                Object.values(JSON.parse(JSON.stringify(products)))
                    .forEach((product) => {
                        return {
                            productKey: product.key,
                            productPrice: product.price,
                            productStock: product.stock,
                        };
                    });
            },
            hasDuplicate(values) {
                let isDuplicate = false;

                values
                    .map(v => v.selected)
                    .sort()
                    .sort((a, b) => {
                        if (a === b) {
                            return isDuplicate = true
                        }
                    });

                return isDuplicate;
            },
            calculateTotal(key) {
                let formFields = this.orderModal.formFields;
                let total = (count, price) => count * price;

                this.getOrderList()
                    .then(() => {
                        let array = this.orders[key].productList;
                        const sum = (...values) => {
                            return values.reduce((total, value) => {
                                return total + value;
                            }, 0);
                        };

                        array.forEach((order) => {
                            let productObj;

                            Object.values(JSON.parse(JSON.stringify(this.products)))
                                .forEach((product) => {
                                    if (product.id === order.selected) {
                                        productObj = {
                                            productKey: product.key,
                                            productPrice: product.price,
                                            productStock: product.stock,
                                        };
                                        return productObj;
                                    }
                                });

                            console.log(sum(...total(order.productCount, productObj.productPrice)));

                        });
                        // this.$set(formFields, 'total', total(order.productCount, productObj.productPrice));

                        // let updatedData = {
                        //     editedResults: cloneDeep(formFields),
                        //     editElement:  key
                        // };
                        //
                        // this.editOrder(updatedData)
                    });
            },

            onCreateOrder() {
                console.log("allGood");
                let orderModal = this.orderModal;
                let formFields = this.orderModal.formFields;

                formFields.id = 'order@_' + Math.random().toString(36).substr(2, 6);
                this.$set(formFields, 'productList', cloneDeep(orderModal.productList));
                orderModal.confirmChangesBtn.isDisabled = true;


                this.createOrder(formFields)
                    .then((path) => {
                        return this.getKeyInDBPath(path);
                    })
                    .then((key) => {
                        this.$set(formFields, 'key', key);

                        let updatedData = {
                            editedResults: cloneDeep(formFields),
                            editElement: formFields.key
                        };

                        this.editOrder(updatedData)
                            .then(() => {
                                this.calculateTotal(key);
                            });

                        return key;
                    })

                // console.log(Object.values(JSON.parse(JSON.stringify(this.products))));
            },
            onEditOrder() {

            },

            /**
             * В зависимости от статуса при котором было открыто модальное окно
             * выполняет создание / ркдактирование заказа
             *
             * @methods {onCreateOrder}
             *          {onEditOrder}
             *
             */
            onConfirm() {
                let status = this.orderModal.status;

                this.$validator.validateAll()
                    .then((result) => {
                        let selectList = document.querySelectorAll('.productList .select2');

                        if (this.hasDuplicate(this.orderModal.productList) === true || this.errors.items.length !== 0) {

                            if (this.hasDuplicate(this.orderModal.productList) === true) {
                                selectList.forEach((item, index) => {
                                    selectList[index].previousElementSibling.classList.add('is-invalid');
                                });
                            } else {
                                selectList.forEach((item, index) => {
                                    selectList[index].previousElementSibling.classList.remove('is-invalid');
                                });
                            }

                            if (this.errors.items.length !== 0) {
                                selectList.forEach((item, index) => {
                                    if (item.previousElementSibling.classList.contains('hasError')) {
                                        selectList[index].previousElementSibling.classList.add('is-invalid');
                                        console.log(selectList[index].previousElementSibling);
                                    }
                                });
                            }
                        } else {
                            if (result && status === 'create')
                                this.onCreateOrder();
                            if (result && status === 'edit')
                                this.onEditOrder();
                        }
                    });
            }

        },
        created() {
            this.getProductList();
            this.getOrderList();
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

    .table {
        .productList {
            margin: 0;
            padding: 0;
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
            &__select-wraper {
                width: calc(100% - 138px);
            }
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