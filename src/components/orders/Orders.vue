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
                        <ul class="orders__product-list product-list">
                            <li v-for="product in products" :key='product.id' class="product-list__item">{{ product.name }} x {{ product.stock }}</li>
                        </ul>
                    </td>
                    <td>{{ order.clientName }}</td>
                    <td>{{ order.phone }}</td>
                    <td>{{ order.total }}</td>
                    <td>{{ order.paid }}</td>
                    <td>{{ order.sent }}</td>
                    <td>
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
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label" for="oreder_clientName">Client Name</label>
                            <div class="col-sm-10">
                                <input
                                        name="clientName" v-model="orderModal.inputFieldsValue.clientName"
                                        v-validate="'required|alpha_spaces'"
                                        :class="{'form-control': true, 'is-invalid': errors.has('clientName') }"
                                        id="oreder_clientName" type="text" placeholder="Name"
                                        aria-describedby="oreder_clientNameHelp">
                                <small id="oreder_clientNameHelp" class="invalid-feedback"> {{ errors.first('clientName') }}</small>
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
                                <small id="oreder_phoneHelp" class="invalid-feedback"> {{ errors.first('phone') }}</small>
                            </div>
                        </div>
                    </form>
                </div>

                <!--<div slot="modal-footer" class="btn-group">-->
                    <!--<BaseButton-->
                            <!--type="primary"-->
                            <!--@click="closeModal">Cancel-->
                    <!--</BaseButton>-->
                    <!--<BaseButton-->
                            <!--:class="(orederModal.status === 'edit'? 'btn-info' : orederModal.status === 'create' ? 'btn-success' : null)"-->
                            <!--:disabled="orederModal.confirmChangesBtn.isDisabled"-->
                            <!--@click="onConfirmChanges()"> {{(orederModal.status === 'edit' ? 'Save changes' :-->
                        <!--orederModal.status === 'create' ? 'Create oreder' : null)}}-->
                    <!--</BaseButton>-->
                <!--</div>-->
            </BaseModal>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    // import {cloneDeep} from "lodash";

    import BaseButton from '@/components/_shared/BaseButton';
    import BaseTable from '@/components/_shared/BaseTable';
    import BaseModal from '@/components/_shared/BaseModal';

    export default {
        name: "Orders",
        components: {
            BaseButton,
            BaseTable,
            BaseModal
        },
        data() {
            return {
                orderModal: {
                    isVisible: false,
                    // confirmChangesBtn: {
                    //     isDisabled: false
                    // },
                    status: '',
                    // imageOnLoadErrorMsg: '',
                    inputFieldsValue: {},
                    // fileLoadInfo: {
                    //     isFlag: false,
                    //     dir: null,
                    //     fileList: null,
                    //     fileReader: null,
                    // }
                },
                table: {
                    isResponsive: true,
                    data: {
                        headNames: ['id', 'Date', 'Products', 'Client Name', 'Phone', 'Total', 'Paid', 'Sent', 'Actions'],
                        bodyContent: [
                            {id: 1, date: '2025-04-01', clientName: 'Belibov Nikolay', phone: '(067) 12 34 567', total: '2340,00', paid: true, sent: false},
                            {id: 2, date: '2025-04-01', clientName: 'Belibov Nikolay', phone: '(067) 12 34 567', total: '2340,00', paid: true, sent: false},
                            {id: 3, date: '2025-04-01', clientName: 'Belibov Nikolay', phone: '(067) 12 34 567', total: '2340,00', paid: true, sent: false},
                            {id: 4, date: '2025-04-01', clientName: 'Belibov Nikolay', phone: '(067) 12 34 567', total: '2340,00', paid: true, sent: false},
                        ],

                    }
                },
            }
        },
        computed: {
            products() {
                return this.$store.state.products;
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


            closeModal() {
                let orderModal = this.orderModal;

                orderModal.isVisible = false;
                // orderModal.confirmChangesBtn.isDisabled = false;
                orderModal.inputFieldsValue = {};
                orderModal.status = '';
            },

        },
        created() {
            this.getProductList();
        }
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

    .product-list{
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        &__item {

        }
        &__item + &__item {
            margin-top: rem(5);
        }
    }
</style>