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
                       :responsive="table.isResponsive">
                <tr slot="tableHead">
                    <th v-for="(headName, index) in table.data.headNames" :key='index'>{{headName}}</th>
                </tr>
                <tr v-for="(product, index) in products" :key='product.id' slot="tableBody">
                    <td>{{ product.id }}</td>
                    <td>{{ product.sku }}</td>
                    <td>
                        <img
                                :src='(product.imageURL) ? product.imageURL : "https://www.freeiconspng.com/uploads/img-landscape-photo-photography-picture-icon-12.png"'
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
                    :isVisible.sync="removeProductModal.isVisible"
                    :title="'Remove this element?'">
                <span slot="modal-header">Remove this element?</span>
                <div slot="modal-footer">
                    <BaseButton type="success"
                                @click.prevent="onRemoveProduct(currentIdElement)">Remove product
                    </BaseButton>
                </div>
            </BaseModal>

            <BaseModal
                    @close="closeModal"
                    classes="products__modal"
                    :isVisible.sync="productModal.isVisible"
                    :title="(productModal.status === 'edit' ? 'Save changes' : productModal.status === 'create' ? 'Create product' : null)">
                <div slot="modal-body">
                    <form autocomplete="off">
                        <input autocomplete="false" name="hidden" type="text" style="display:none;">
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label" for="product_sku">SKU</label>
                            <div class="col-sm-10">
                                <input
                                        name="sku" v-model="productModal.inputFieldsValue.sku"
                                        v-validate="'required|alpha_dash'"
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
                                        name="name" v-model="productModal.inputFieldsValue.name" v-validate="'required'"
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
                                        name="stock" v-model="productModal.inputFieldsValue.stock"
                                        v-validate="'required|numeric'"
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
                                        name="purPrice" v-model="productModal.inputFieldsValue.purPrice"
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
                                        name="price" v-model="productModal.inputFieldsValue.price"
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
                                    <div class="preview-img"
                                         v-if="productModal.inputFieldsValue.imageBase64">
                                        <img :src="productModal.inputFieldsValue.imageBase64" style="max-width: 150px"/>
                                        <span @click.prevent="removeImageWithPtoduct">&times;</span>
                                    </div>
                                    <div v-else>
                                        <div v-if="!productModal.fileLoadInfo.base64ImageFormat">
                                            <input type="file" class="custom-file-input" id="customFile"
                                                   @change="onFileChange">
                                            <label class="custom-file-label" for="customFile">Select File</label>
                                            <div v-show="productModal.fileLoadInfo.imageOnLoadErrorMsg === null"
                                                 class="custom-file__description">
                                                <span>maxFilesize: 2MB</span> |
                                                <span>png or jpeg only</span>
                                            </div>
                                            <div class="custom-file__error">{{
                                                productModal.fileLoadInfo.imageOnLoadErrorMsg }}
                                            </div>
                                        </div>
                                        <div v-else>
                                            <div class="preview-img">
                                                <img :src="productModal.fileLoadInfo.base64ImageFormat"
                                                     style="max-width: 150px"/>
                                                <span @click.prevent="removeOnLoadImage">&times;</span>
                                            </div>
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
                            :class="(productModal.status === 'edit'? 'btn-info' : productModal.status === 'create' ? 'btn-success' : null)"
                            :disabled="productModal.confirmChangesBtn.isDisabled"
                            @click="onConfirmChanges()"> {{(productModal.status === 'edit' ? 'Save changes' :
                        productModal.status === 'create' ? 'Create product' : null)}}
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
                productModal: {
                    isVisible: false,
                    confirmChangesBtn: {
                        isDisabled: false
                    },
                    status: '',
                    inputFieldsValue: {},
                    fileLoadInfo: {
                        base64ImageFormat: '',
                        fileList: null,
                        complexFile: null,
                        imageOnLoadErrorMsg: null
                    }
                },
                removeProductModal: {
                    isVisible: false
                },
                table: {
                    isResponsive: true,
                    data: {
                        headNames: ['id', 'SKU', 'Image', 'Name', 'Purchase Price', 'Price', 'Stock', 'Actions'],
                    }
                },
                currentIdElement: '',
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
            onCreateProduct() {
                this.productModal.status = 'create';
                this.productModal.isVisible = true;
            },
            editProductHandler(product, index) {
                this.productModal.inputFieldsValue = cloneDeep(product);
                this.productModal.status = 'edit';
                this.currentIdElement = index;
                this.productModal.isVisible = true;
            },
            confirmModalHandler(index) {
                this.removeProductModal.isVisible = true;
                this.currentIdElement = index;
            },
            closeModal() {
                this.productModal.isVisible = false;
                this.productModal.confirmChangesBtn.isDisabled = false;
                this.productModal.inputFieldsValue = {};
                this.productModal.status = '';
                this.currentIdElement = '';
                this.productModal.fileLoadInfo.imageOnLoadErrorMsg = null;
                this.removeOnLoadImage();
            },
            closeModalConfirm() {
                this.removeProductModal.isVisible = false;
                this.currentIdElement = '';
            },
            onFileChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                this.productModal.fileLoadInfo.fileList = files;
                this.productModal.fileLoadInfo.imageOnLoadErrorMsg = null;

                const validateLoadingImage = (file) => {
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
                                    this.productModal.fileLoadInfo.base64ImageFormat = baseReader.result;
                                    this.productModal.fileLoadInfo.complexFile = {
                                        dir: this.$route.name,
                                        base64Image: baseReader.result,
                                        fileList: this.productModal.fileLoadInfo.fileList,
                                        fileReader: file
                                    };
                                    resolve(baseReader.result);
                                });
                            } else reject();
                        });
                    });
                };

                validateLoadingImage(e.target.files[0])
                    .then(() => {
                        this.productModal.fileLoadInfo.imageOnLoadErrorMsg = null;
                    })
                    .catch(() => {
                        this.productModal.fileLoadInfo.imageOnLoadErrorMsg = 'You may upload png or jpeg file 2MB max';
                    })
            },
            removeOnLoadImage: function () {
                this.productModal.fileLoadInfo.base64ImageFormat = '';
                this.productModal.fileLoadInfo.fileList = null;
                this.productModal.fileLoadInfo.complexFile = null;
            },
            removeImageWithPtoduct() {
                let payload = {
                    elId: this.currentIdElement,
                    imageName: this.productModal.inputFieldsValue.imageName
                };
                this.$store.dispatch('removeImagesFromDB', payload);
            },
            // Product evt
            // Add product
            onAddProduct() {
                this.productModal.confirmChangesBtn.isDisabled = true;
                this.productModal.inputFieldsValue.id = '_' + Math.random().toString(36).substr(2, 9);
                this.addProduct(this.productModal.inputFieldsValue)
                    .then((path) => {
                        let routePath = `/${this.$route.name}/`;
                        let startnum = path.indexOf(routePath) + routePath.length;
                        let key = path.slice(startnum, path.length);
                        this.productModal.fileLoadInfo.complexFile.databaseId = key;
                        return key;
                    })
                    .then((key) => {
                        if (this.productModal.fileLoadInfo.complexFile !== null) {
                            this.currentIdElement = key;
                            this.productModal.inputFieldsValue.imageName = this.productModal.fileLoadInfo.complexFile.fileReader.name;
                            return (this.loadImages(this.productModal.fileLoadInfo.complexFile));
                        } else {
                            return
                        }
                    })
                    .then((url) => {
                        if (url) {
                            this.productModal.inputFieldsValue.imageURL = url;
                            this.productModal.inputFieldsValue.imageBase64 = this.productModal.fileLoadInfo.complexFile.base64Image;
                            this.productModal.fileLoadInfo.complexFile = null;
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
                    editedResults: cloneDeep(this.productModal.inputFieldsValue),
                    editElement: this.currentIdElement
                };
                this.productModal.confirmChangesBtn.isDisabled = true;
                this.editProduct(data)
                    .then(() => {
                        if (this.productModal.fileLoadInfo.complexFile !== null) {
                            return (this.loadImages(this.productModal.fileLoadInfo.complexFile));
                        } else {
                            return
                        }
                    })
                    .then((url) => {
                        if (url) {
                            this.productModal.inputFieldsValue.imageURL = url;
                            this.productModal.inputFieldsValue.imageBase64 = this.productModal.fileLoadInfo.complexFile.base64Image;
                            this.productModal.fileLoadInfo.complexFile = null;
                            // FIXME: Рекурсия?
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
            onConfirmChanges() {
                this.$validator.validateAll()
                    .then((result) => {
                        if (result && this.productModal.status === 'create') {
                            this.onAddProduct();
                            return;
                        }
                        if (result && this.productModal.status === 'edit') {
                            this.onEditProduct();
                            return;
                        }
                    })
                    .catch((error) => error);
            }
        },
        created() {
            this.getProductList();
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
