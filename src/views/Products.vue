<template>
    <div class="products">
        <div class='container'>
            <button type="button" class="btn btn-secondary createProduct products__btn products__btn--showModal "
                    @click="onCreateProduct">Create New Product
            </button>

            <div class="products__table table-responsive">
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th v-for="(item, index) in thead" :key='index'>{{item}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(product, index) in products" :key='product.id'>
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
                                    @click="editProductHandler(product, index)">
                                <span class="oi oi-pencil"></span>
                            </button>
                            <button type="button" class="btn btn-primary btn-edit"
                                    @click="confirmModalHandler(index)">
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
                    <button type="button" class="btn btn-success" @click.prevent="onRemoveProduct(editedEL)">
                        Remove product
                    </button>
                </div>
            </Modal>

            <Modal v-if="showModal" @close="closeModal" @validate="validate()" :modalStatus="changeStatus()"
                   :hasContent="true">
                <span slot="modal-header">Product</span>

                <div slot="modal-body">
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
                                <div v-if="!image">
                                    <input type="file" class="custom-file-input" id="customFile"
                                           @change="onFileChange">
                                    <label class="custom-file-label" for="customFile">Select File</label>
                                </div>
                                <div v-else>
                                    <div class="preview-img">
                                        <img :src="image" style="max-width: 150px"/>
                                        <span @click.prevent="removeImage">&times;</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div slot="modal-btn">
                    <button
                            type="button"
                            :class="{'btn': true, 'btn-primary': status === 'edit', 'btn-success': status === 'create'}"
                            @click="validateFields()">
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
                image: '',
                uploadFile: null,
                fileData: null
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
            validate() {
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
            onCreateProduct() {
                this.status = 'create';
                this.showModal = true;
            },
            editProductHandler(product, index) {
                this.modalFields = cloneDeep(product);
                this.status = 'edit';
                this.editedEL = index;
                this.showModal = true;
            },
            confirmModalHandler(index) {
                this.showModalConfirm = true;
                this.editedEL = index;
            },
            closeModal() {
                this.showModal = false;
                this.modalFields = {};
                this.status = '';
                this.editedEL = '';
                this.removeImage();
            },
            closeModalConfirm() {
                this.showModalConfirm = false;
                this.editedEL = '';
            },
            onFileChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                this.uploadFile = files;
                // console.log(files);
                if (!files.length)
                    return;
                this.createImage(files[0]);
            },
            createImage(file) {
                let reader = new FileReader();
                reader.onload = (e) => {
                    // console.log(e.target);
                    this.image = e.target.result;
                    this.fileData = {
                        dir: this.$route.name,
                        fileList: this.uploadFile,
                        fileReader: file
                    };
                };
                reader.readAsDataURL(file);
            },
            removeImage: function () {
                this.image = '';
                this.uploadFile = null;
                this.fileData = null;
            },
            // Product evt
            // Add product
            onAddProduct() {
                this.modalFields.id = '_' + Math.random().toString(36).substr(2, 9);
                this.addProduct(this.modalFields)
                    .then((path) => {
                        let routePath = `/${this.$route.name}/`;
                        let startnum = path.indexOf(routePath) + routePath.length;
                        let key = path.slice(startnum, path.length);
                        return key;
                    })
                    .then((key) => {
                        if (this.fileData !== null) {
                            this.editedEL = key;
                            return (this.loadImages(this.fileData));
                        } else {
                            return
                        }
                    })
                    .then((url) => {
                        if (url) {
                            this.modalFields.image = url;
                            this.fileData = null;
                            this.onEditProduct();
                        } else {
                            this.closeModal();
                            this.getProductList();
                        }
                    })
            },
            //Edit product
            onEditProduct() {
                let data = {
                    editedResults: cloneDeep(this.modalFields),
                    editElement: this.editedEL
                };
                this.editProduct(data)
                    .then(() => {
                        if (this.fileData !== null) {
                            return (this.loadImages(this.fileData));
                        } else {
                            return
                        }
                    })
                    .then((url) => {
                        if (url) {
                            this.modalFields.image = url;
                            this.fileData = null;
                            this.onEditProduct();
                        } else {
                            this.closeModal();
                            this.getProductList();
                        }
                    });
            },
            //Remove product
            onRemoveProduct(index) {
                this.removeProduct(index);
                this.closeModalConfirm();
                this.getProductList();
            },
            validateFields() {
                this.$validator.validateAll()
                    .then((result) => {
                        if (result && this.status === 'create') {
                            this.onAddProduct();
                            return;
                        }
                        if (result && this.status === 'edit') {
                            this.onEditProduct();
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

    .preview-img {
        position: relative;
        display: inline-grid;
        width: 150px;
        height: auto;
        &:hover {
            span {
                visibility: visible;
                opacity: 1;
            }
        }
        span {
            visibility: hidden;
            opacity: 0;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            width: 20px;
            height: 20px;
            position: absolute;
            top: 5px;
            right: 5px;
            color: red;
            background: transparent;
        }
    }
</style>
