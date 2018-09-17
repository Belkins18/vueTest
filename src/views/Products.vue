<template>
    <div class="products">
        <div class='container'>
            <button type="button" class="btn btn-secondary createProduct products__btn products__btn--showModal "
                    @click="createProduct">Create New Product
            </button>
            <div class="products__table table-responsive">
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th v-for="(item, index) in thead" :key='index'>{{item}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(product, index) in products" :key='index'>
                        <td>{{ product.id }}</td>
                        <td>{{ product.sku }}</td>
                        <td><img :src='(product.image) ? product.image : "https://www.freeiconspng.com/uploads/img-landscape-photo-photography-picture-icon-12.png"' alt='' width='20px'></td>
                        <td>{{product.name}}</td>
                        <td>{{product.purPrice}}</td>
                        <td>{{product.price}}</td>
                        <td>{{product.stock}}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-edit" @click="editProduct(product, index)">
                                <span class="oi oi-pencil"></span>
                            </button>
                            <button type="button" class="btn btn-primary btn-edit" @click="removeProduct(index)">
                                <span class="oi oi-trash"></span>
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <Modal v-if="showModal" @close="closeModal" :modalStatus="changeStatus()">
                <span slot="modal-header">Product</span>

                <div slot="modal-body">
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_sku">SKU</label>
                        <div class="col-sm-10">
                            <input
                                    v-validate="{ required: true}"
                                    v-model="modalFields.sku"
                                    type="text"
                                    id="product_sku"
                                    class="form-control"
                                    placeholder="SKU"
                                    aria-describedby="product_skuHelp">
                            <small id="product_skuHelp" class="invalid-feedback">We'll never share your email with
                                anyone else.
                            </small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_name">Name</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="modalFields.name" placeholder="Name"
                                   class="form-control" id="product_name" aria-describedby="product_nameHelp">
                            <small id="product_nameHelp" class="invalid-feedback">We'll never share your email with
                                anyone else.
                            </small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_stock">Stock</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="modalFields.stock" placeholder="Stock"
                                   class="form-control is-invalid" id="product_stock" aria-describedby="product_stockHelp">
                            <small id="product_stockHelp" class="invalid-feedback">We'll never share your email with
                                anyone else.
                            </small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_purprice">Purchase Price</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="modalFields.purPrice"
                                   placeholder="Purchase Price" class="form-control is-valid" id="product_purprice"
                                   aria-describedby="product_purpriceHelp">
                            <small id="product_purpriceHelp" class="invalid-feedback">We'll never share your email
                                with anyone else.
                            </small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_price">Price</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="modalFields.price" placeholder="Price"
                                   class="form-control" id="product_price" aria-describedby="product_priceHelp">
                            <small id="product_priceHelp" class="invalid-feedback">We'll never share your email with
                                anyone else.
                            </small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_price">Images</label>
                        <div class="col-sm-10">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="customFile">
                                <label class="custom-file-label" for="customFile">Choose file</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div slot="modal-btn">
                    <button v-if="status === 'edit'" type="button" class="btn btn-primary" @click.prevent="editedProductField()">Save changes</button>
                    <button v-if="status === 'create'" type="button" class="btn btn-success" @click.prevent="onsubmitAddProduct()">Add product</button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import VeeValidate from 'vee-validate';

    import Modal from "@/components/Modal.vue";
    import {cloneDeep} from "lodash"
    import {Object_size} from '../helpers'

    Vue.use(VeeValidate);

    export default {
        name: "products",
        components: {
            Modal
        },
        data() {
            return {
                showModal: false,
                status: '',
                thead: ['id', 'SKU', 'Image', 'Name', 'Purchase Price', 'Price', 'Stock', 'Actions'],
                modalFields: {},
                editedEL: ''
            };
        },
        computed: {
            products() {
                return this.$store.state.products;
            },
        },
        methods: {
            changeStatus() {
              if (this.status === 'edit') {
                  return 'Edit';
              } else if (this.status === 'create') {
                  return 'Create new';
              }
            },
            createProduct() {
                this.status = 'create';
                this.showModal = true;
            },
            editProduct(product, index) {
                this.modalFields = cloneDeep(product);
                console.log(index);
                this.status = 'edit';
                this.editedEL = index;
                this.showModal = true;
                this.$store.dispatch('getProductList');
            },
            closeModal() {
                this.showModal = false;
                this.modalFields = {};
                this.status = '';
                this.editedEL = '';
            },
            onsubmitAddProduct() {
                this.modalFields.id = Object_size(this.products) + 1;
                this.$store.dispatch('setProtuctToProductList', this.modalFields);
                this.closeModal();
                this.$store.dispatch('getProductList');

            },
            removeProduct(index) {
                this.$store.dispatch('removeProtuctWithProductList', index);
                this.closeModal();
                this.$store.dispatch('getProductList');
            },
            editedProductField() {
                let payload = {
                    editedResults: cloneDeep(this.modalFields),
                    editElement: this.editedEL
                };
                this.$store.dispatch('editProtuctWithProductList', payload);
                this.closeModal();
                this.$store.dispatch('getProductList');
            },
        },
        created() {
            this.$store.dispatch('getProductList');

            // this.$store.getters.getDBFirebaseUsers.once("value")
            //     .then(function (snapshot) {
            //         let value = snapshot.val();
            //         let key = snapshot.key;
            //         console.log(key);
            //         console.log(value);
            //         console.log(snapshot.child('admin').val());
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //     });
        },
    };
</script>

<style scoped lang="scss">
    .products {
        margin-top: 60px;
        padding-top: 50px;
        &__btn {
            &--showModal {
                margin-bottom: 30px;
            }
        }
        &__table {
            table {
                min-width: $table-min-width;
                box-shadow: $el-box-shadow;
            }
        }
    }

    .btn-edit {
        position: relative;
        width: 2rem;
        height: 2rem;
        margin: 0.1rem;
        .oi {
            position: absolute;
            top: 50%;
            left: 50%;
            font-size: 14px;
            transform: translateX(-50%) translateY(-50%);
        }
    }

</style>
