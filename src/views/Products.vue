<template>
    <div class="products">
        <div class='container'>
            <!-- FIXME: userHandler - странный префикс, выбери или onCreateProduct или CreateProductHandler, все остальное – не от мира сего)) -->
            <button type="button" class="btn btn-secondary createProduct products__btn products__btn--showModal "
                    @click="userHandlerCreateProduct">Create New Product
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
                        <td>
                            <img
                                :src='(product.image) ? product.image : "https://www.freeiconspng.com/uploads/img-landscape-photo-photography-picture-icon-12.png"'
                                alt='' width='47px'>
                        </td>
                        <td>{{product.name}}</td>
                        <td>{{product.purPrice}}</td>
                        <td>{{product.price}}</td>
                        <td>{{product.stock}}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-edit"
                                    @click="userHandlerEditProduct(product, index)">
                                <span class="oi oi-pencil"></span>
                            </button>
                            <button type="button" class="btn btn-primary btn-edit"
                                    @click="userHandlerConfirmModal(index)">
                                <!--@click="onSubmitRemoveProduct(index)">-->
                                <span class="oi oi-trash"></span>
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <Modal v-if="showModalConfirm" @close="closeModalConfirm">
                <span slot="modal-header">Remove this element?</span>
                <div slot="modal-body" hidden></div>
                <div slot="modal-btn">
                    <button type="button" class="btn btn-success" @click.prevent="onSubmitRemoveProduct(editedEL)">
                        Remove product
                    </button>
                </div>
            </Modal>

            <Modal v-if="showModal" @close="closeModal" @validate="validate()" :modalStatus="changeStatus()" :hasContent="true">
                <span slot="modal-header">Product</span>

                <div slot="modal-body">
                    <div class="modal-body">

                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label" for="product_sku">SKU</label>
                            <div class="col-sm-10">
                                <input
                                        name="sku" v-model="modalFields.sku" v-validate="'required|alpha_dash'"
                                        :class="{'form-control': true, 'is-invalid': errors.has('sku') }"
                                        id="product_sku" type="text" placeholder="SKU"
                                        aria-describedby="product_skuHelp">
                                <small id="product_skuHelp" class="invalid-feedback"> {{ errors.first('sku') }}</small>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label" for="product_name">Name</label>
                            <div class="col-sm-10">
                                <input
                                        name="name" v-model="modalFields.name" v-validate="'required'"
                                        :class="{'form-control': true, 'is-invalid': errors.has('name') }"
                                        id="product_name" type="text" placeholder="Name"
                                        aria-describedby="product_nameHelp">
                                <small id="product_nameHelp" class="invalid-feedback"> {{ errors.first('name') }}
                                </small>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label" for="product_stock">Stock</label>
                            <div class="col-sm-10">
                                <input
                                        name="stock" v-model="modalFields.stock" v-validate="'required|numeric'"
                                        :class="{'form-control': true, 'is-invalid': errors.has('stock') }"
                                        id="product_stock" type="text" placeholder="Stock"
                                        aria-describedby="product_stockHelp">
                                <small id="product_stockHelp" class="invalid-feedback"> {{ errors.first('stock') }}
                                </small>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label" for="product_purprice">Purchase Price</label>
                            <div class="col-sm-10">
                                <input
                                        name="purPrice" v-model="modalFields.purPrice"
                                        v-validate="{ required: true, regex: /\b\d+,\d{2}\b/ }"
                                        :class="{'form-control': true, 'is-invalid': errors.has('purPrice') }"
                                        id="product_purprice" type="text" placeholder="__,__"
                                        aria-describedby="product_purpriceHelp">
                                <small id="product_purpriceHelp" class="invalid-feedback">{{ errors.first('purPrice') }}
                                </small>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label" for="product_price">Price</label>
                            <div class="col-sm-10">
                                <input
                                        name="price" v-model="modalFields.price"
                                        v-validate="{ required: true, regex: /\b\d+,\d{2}\b/ }"
                                        :class="{'form-control': true, 'is-invalid': errors.has('price') }"
                                        id="product_price" type="text" placeholder="__,__"
                                        aria-describedby="product_priceHelp">
                                <small id="product_priceHelp" class="invalid-feedback"> {{ errors.first('price') }}
                                </small>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label" for="product_price">Images</label>
                            <div class="col-sm-10">
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" id="customFile"
                                           @change="onFileChanged">
                                    <label class="custom-file-label" for="customFile">
                                        {{modalFields.selectedFile}} </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div slot="modal-btn">
                    <button
                            type="button"
                            :class="{'btn': true, 'btn-primary': status === 'edit', 'btn-success': status === 'create'}"
                            @click.prevent="validateBeforeSubmit()">
                        {{ changeStatus() }}
                    </button>
                    <!--<button v-if="status === 'edit'" type="button" class="btn btn-primary"-->
                    <!--@click.prevent="onSubmitEditProduct()">Save changes-->
                    <!--</button>-->
                    <!--<button v-if="status === 'create'" type="button" class="btn btn-success"-->
                    <!--@click.prevent="validateBeforeSubmit()">Add product-->
                    <!--</button>-->
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapActions} from 'vuex';
    // import axios from 'axios';
    import VeeValidate from 'vee-validate';

    import Modal from "@/components/modals/Modal.vue";
    import {cloneDeep} from "lodash";

    Vue.use(VeeValidate);

    export default {
        name: "products",
        components: {
            Modal
        },
        data() {
            return {
                showModal: false,
                showModalConfirm: false,
                status: '',
                thead: ['id', 'SKU', 'Image', 'Name', 'Purchase Price', 'Price', 'Stock', 'Actions'],
                modalFields: {},
                editedEL: '',
            };
        },
        computed: {
            products() {
                return this.$store.state.products;
            },
        },
        methods: {
            ...mapActions([
                'addProduct',
                'editProduct',
                'removeProduct',
                'getProductList',
                'loadImages'
            ]),
            validate(){
                alert("onsubmit")
            },
            // Modal
            changeStatus() {
                if (this.status === 'edit') {
                    return 'Save changes'
                }
                if (this.status === 'create') {
                    return 'Add product'
                }
            },
            userHandlerCreateProduct() {
                this.status = 'create';
                this.showModal = true;
            },
            userHandlerConfirmModal(index) {
                this.showModalConfirm = true;
                this.editedEL = index;
            },
            userHandlerEditProduct(product, index) {
                this.modalFields = cloneDeep(product);
                this.status = 'edit';
                this.editedEL = index;
                this.showModal = true;
            },
            closeModal() {
                this.showModal = false;
                this.modalFields = {};
                this.status = '';
                this.editedEL = '';
            },
            closeModalConfirm() {
                this.showModalConfirm = false;
                this.editedEL = '';
            },
            onFileChanged(event) {
                this.modalFields.selectedFile = event.target.files[0];
                console.log(this.modalFields.selectedFile);
                let fileData = {
                    dir: this.$route.name,
                    file: this.modalFields.selectedFile
                };
                this.loadImages(fileData)
                    .then((url) => {
                        console.log(url);
                        this.modalFields.image = url;
                    });
                // axios.post('https://api.cloudinary.com/v1_1/belkins/image/upload', formData)
                //     .then((response)=>{
                //         alert(response);
                //     })
                //     .catch((error) => error)
            },
            // Product evt
            // Add product
            onSubmitAddProduct() {
                if (this.products) {
                    console.log(Object.keys(this.products));
                    console.log(Object.keys(this.products).length);
                } else {
                    alert('product not found')
                }
                // this.modalFields.id = Object.keys(this.products).length + 1;
                // this.onFileChanged();
                console.log(this.modalFields);
                this.addProduct(this.modalFields);
                this.closeModal();
                this.getProductList();
            },
            //Edit product
            onSubmitEditProduct() {
                let data = {
                    editedResults: cloneDeep(this.modalFields),
                    editElement: this.editedEL
                };
                this.editProduct(data);
                this.closeModal();
                this.getProductList();
            },
            //Remove product
            onSubmitRemoveProduct(index) {
                this.removeProduct(index);
                this.closeModalConfirm();
                this.getProductList();
            },
            validateBeforeSubmit() {
                this.$validator.validateAll()
                    .then((result) => {
                        if (result && this.status === 'create') {
                            this.onSubmitAddProduct();
                            return;
                        }
                        if (result && this.status === 'edit') {
                            this.onSubmitEditProduct();
                            return;
                        }
                    })
                    .catch((error) => error);
            }
        },
        created() {
            this.getProductList();

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
        margin-top: 56px;
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
            tr > td {
                vertical-align: middle;
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
