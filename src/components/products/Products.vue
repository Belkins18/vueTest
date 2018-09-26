<template>
    <div class="products">
        <div class='container'>
            <BaseButton classes="createProduct products__btn products__btn--showModal"
                        type="secondary"
                        @click="onCreateProduct">
                Create New Product
            </BaseButton>

            <BaseTable classes="products__table"
                       :darkTheme="false"
                       :bordered="false"
                       :responsive="responsive">
                <tr slot="tableHead">
                    <th v-for="(item, index) in tableData.head" :key='index'>{{item}}</th>
                </tr>
                <tr v-for="(product, index) in products" :key='product.id' slot="tableBody">
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
                        <BaseButton classes="products__btn"
                                    type="info"
                                    icon="pencil"
                                    @click="editProductHandler(product, index)"
                                    :circle="true">
                        </BaseButton>

                        <BaseButton classes="products__btn"
                                    type="danger"
                                    icon="trash"
                                    :circle="true"
                                    @click="confirmModalHandler(index)">
                        </BaseButton>
                    </td>
                </tr>
            </BaseTable>

            <BaseModal
                    @close="closeModalConfirm"
                    :isVisible.sync="showModalConfirm"
                    :title="'Remove this element?'">
                <span slot="modal-header">Remove this element?</span>
                <div slot="modal-footer">
                    <BaseButton type="success"
                                @click.prevent="onRemoveProduct(editedEL)">Remove product
                    </BaseButton>
                </div>
            </BaseModal>

            <BaseModal
                    @close="closeModal"
                    @validate="validate()"
                    classes="products__modal"
                    :isVisible.sync="showModal"
                    :title="changeStatus">
                <div slot="modal-body">
                    <form autocomplete="off">
                        <input autocomplete="false" name="hidden" type="text" style="display:none;">
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
                                        v-validate="{ required: true}"
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
                                        v-validate="{ required: true}"
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
                                        <div v-show="error === null" class="custom-file__description">
                                            <span>maxFilesize: 2MB</span> |
                                            <span>png or jpeg only</span>
                                        </div>
                                        <div class="custom-file__error">{{ error }}</div>

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
                    </form>
                </div>

                <div slot="modal-footer" class="btn-group">
                    <BaseButton
                            type="primary"
                            @click="closeModal">Close
                    </BaseButton>
                    <BaseButton
                            :class="btnTypeStatus"
                            :disabled="disabled"
                            @click="validateFields()"> {{ changeStatus }}
                    </BaseButton>
                </div>
            </BaseModal>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import VeeValidate from 'vee-validate';
    import {mapActions} from 'vuex';
    import {cloneDeep} from "lodash";

    import BaseButton from "@/components/_shared/BaseButton";
    import BaseTable from "@/components/_shared/BaseTable";
    import BaseModal from "@/components/_shared/BaseModal";

    Vue.use(VeeValidate);

    export default {
        name: "products",
        components: {
            BaseButton,
            BaseTable,
            BaseModal,
        },
        data() {
            return {
                disabled: false,
                showModal: false,
                showModalConfirm: false,
                responsive: true,
                status: '',
                tableData: {
                    head: ['id', 'SKU', 'Image', 'Name', 'Purchase Price', 'Price', 'Stock', 'Actions'],
                },
                modalFields: {},
                editedEL: '',
                image: '',
                uploadFile: null,
                fileData: null,
                error: null,
            };
        },
        computed: {
            pending() {
                return this.$store.state.pending;
            },
            products() {
                return this.$store.state.products;
            },
            changeStatus() {
                if (this.status === 'edit') {
                    return 'Save changes'
                }
                if (this.status === 'create') {
                    return 'Create product'
                }
            },
            btnTypeStatus() {
                if (this.status === 'edit') {
                    return 'btn-info'
                }
                if (this.status === 'create') {
                    return 'btn-success'
                }
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
                this.disabled = false;
                this.modalFields = {};
                this.status = '';
                this.editedEL = '';
                this.error = null;
                this.removeImage();
            },
            closeModalConfirm() {
                this.showModalConfirm = false;
                this.editedEL = '';
            },
            onFileChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                this.uploadFile = files;
                this.error = null;
                this.validateLoadingImage(e.target.files[0])
                    .then(() => {
                        this.error = null;
                    })
                    .catch(() => {
                        this.error = 'You may upload png or jpeg file 2MB max';
                    })
            },
            validateLoadingImage(file) {
                return new Promise((resolve, reject) => {
                    let typeReader = new FileReader();
                    let baseReader = new FileReader();
                    let MAX_SIZE_IN_BYTES = 2097152;
                    let header = "";
                    let type = "";

                    typeReader.readAsArrayBuffer(file);
                    typeReader.addEventListener("loadend", arrayBuffer => {
                        new Uint8Array(arrayBuffer.target.result)
                            .subarray(0, 4)
                            .forEach(byte => (header += byte.toString(16)));

                        switch (header) {
                            case "89504e47":
                                type = "image/png";
                                break;
                            case "ffd8ffe0":
                            case "ffd8ffe1":
                            case "ffd8ffe2":
                            case "ffd8ffe3":
                            case "ffd8ffe8":
                                type = "image/jpeg";
                        }

                        if (type && file.size < MAX_SIZE_IN_BYTES) {
                            baseReader.readAsDataURL(file);
                            baseReader.addEventListener("load", () => {
                                console.log(baseReader.result);
                                this.image = baseReader.result;
                                this.fileData = {
                                    dir: this.$route.name,
                                    fileList: this.uploadFile,
                                    fileReader: file
                                };
                                resolve(baseReader.result)
                            });
                        } else reject();
                    });
                });
            },
            removeImage: function () {
                this.image = '';
                this.uploadFile = null;
                this.fileData = null;
            },
            // Product evt
            // Add product
            onAddProduct() {
                this.disabled = true;
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
                this.disabled = true;
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
        &__modal {
            .modal-footer {
                background: $red;
            }
        }
        &__btn + &__btn {
            margin: rem(5);
        }
    }

    .custom-file {
        &__description,
        &__error {
            font-size: rem(12);
        }
        &__description {
            color: $gray-500;
        }
        &__error {
            color: $red;
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
