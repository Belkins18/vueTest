<template>
    <div class="products">
        <div class='container'>
            <BaseButton classes="createProduct products__btn products__btn--showModal"
                        type="secondary"
                        @click="createProductHandler">
                Create New Product
            </BaseButton>

            <BaseTable classes="products__table"
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
                                    @click="removeProductHandler(index)">
                        </BaseButton>
                    </td>
                </tr>
            </BaseTable>

            <BaseModal
                    @close="closeRemoveModal"
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

                                    <div v-if="productModal.inputFieldsValue.imageURL && productModal.inputFieldsValue.imageBase64">
                                        <div class="preview-img">
                                            <img :src="productModal.inputFieldsValue.imageBase64"
                                                 style="max-width: 150px"/>
                                            <span @click.prevent="removeLoadImageHandler">&times;</span>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div v-if="productModal.fileLoadInfo.isFlag">
                                            <div class="preview-img">
                                                <img :src="productModal.inputFieldsValue.imageBase64"
                                                     style="max-width: 150px"/>
                                                <span @click.prevent="removeLoadImageHandler">&times;</span>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <input type="file" class="custom-file-input" id="customFile"
                                                   @change="onFileChange">
                                            <label class="custom-file-label" for="customFile">Select File</label>
                                            <div v-show="!productModal.imageOnLoadErrorMsg"
                                                 class="custom-file__description">
                                                <span>maxFilesize: 2MB</span> |
                                                <span>png or jpeg only</span>
                                            </div>
                                            <div class="custom-file__error">{{
                                                productModal.imageOnLoadErrorMsg }}
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
                            @click="closeModal">Cancel
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
    import {mapActions} from 'vuex';
    import {cloneDeep} from "lodash";

    import BaseButton from "@/components/_shared/BaseButton";
    import BaseTable from "@/components/_shared/BaseTable";
    import BaseModal from "@/components/_shared/BaseModal";


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
                    imageOnLoadErrorMsg: '',
                    inputFieldsValue: {},
                    fileLoadInfo: {
                        isFlag: false,
                        dir: null,
                        fileList: null,
                        fileReader: null,
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
                'deleteImgFromFbStorage',
                'getProductList',
                'loadImages'
            ]),

            // ОТКРыВАНИЕ МОДАЛЬНыХ ОКОН
            /**
             * Открывает модальное окно создания продукта
             *
             */
            createProductHandler() {
                let productModal = this.productModal;
                productModal.status = 'create';
                productModal.isVisible = true;
            },

            /**
             * Открывает модальное окно редактирования продукта
             *
             * @param {Object} product - объект из полей продуска.
             *        {String} index - id ячейки продукта в RealTime Database (Firebase)
             *
             */
            editProductHandler(product, index) {
                let productModal = this.productModal;
                let loadInfo = this.productModal.fileLoadInfo;

                this.currentIdElement = index;
                productModal.isVisible = true;
                productModal.inputFieldsValue = cloneDeep(product);
                productModal.status = 'edit';

                this.$set(loadInfo, 'productFbId', index);
            },

            /**
             * Открывает модальное окно удаления продукта
             *
             * @param {String} index - id ячейки продукта в RealTime Database (Firebase)
             *
             */
            removeProductHandler(index) {
                this.removeProductModal.isVisible = true;
                this.currentIdElement = index;
            },

            // ЗАКРЫВАНИЕ МОДАЛЬНЫХ ОКОН
            /**
             * Закрывает модальное окно создания/редактирования продукта
             * Снимает значение id ячейки продукта в RealTime Database (Firebase) (для модального окна редактирования)
             * Очищает заполненные поля формы, статус, сообщение о ошибке при загрузке файла
             * Убирает атрибут disabled с кнопок 'Create product', 'Edit product'
             *
             */
            closeModal() {
                let productModal = this.productModal;
                let loadInfo = this.productModal.fileLoadInfo;

                this.currentIdElement = '';
                this.removeLoadImageHandler();
                productModal.isVisible = false;
                productModal.confirmChangesBtn.isDisabled = false;
                productModal.inputFieldsValue = {};
                productModal.status = '';
                productModal.imageOnLoadErrorMsg = '';

                this.$set(loadInfo, 'productFbId', null);
            },

            /**
             * Закрывает модальное окно удаления продукта
             * Снимает значение id ячейки продукта в RealTime Database (Firebase) (для модального окна редактирования)
             *
             */
            closeRemoveModal() {
                this.removeProductModal.isVisible = false;
                this.currentIdElement = '';
            },

            // МЕТОДЫ ДЛЯ РАБОТЫ С ФАЙЛАМИ КАТРИНОК
            /**
             * Следит за изменением input[type='file']
             *
             * @param {event} event - event input[type='file'].
             *
             */
            onFileChange(event) {
                let files = event.target.files || event.dataTransfer.files;
                let productModal = this.productModal;
                let loadInfo = this.productModal.fileLoadInfo;

                loadInfo.fileList = files;
                productModal.imageOnLoadErrorMsg = '';

                /**
                 * Проверяет файл что пытаемся загрузить на соответсвие параметрам:
                 * png or jpeg file 2MB max
                 *
                 * @param {file} file - файл что загружается
                 * @return {Promise}
                 * resolve - base64 typeFile format (для отрисовки превью)
                 * reject - вернет код ошибки
                 */
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
                                    this.$set(productModal.inputFieldsValue, 'imageBase64', baseReader.result);
                                    this.$set(productModal.inputFieldsValue, 'imageName', file.name);

                                    this.$set(loadInfo, 'isFlag', true);
                                    this.$set(loadInfo, 'dir', this.$route.name);
                                    this.$set(loadInfo, 'fileReader', file);
                                    console.log(this.productModal.fileLoadInfo);
                                    resolve(baseReader.result);
                                });
                            } else reject();
                        });
                    });
                };

                validateLoadingImage(event.target.files[0])
                    .then(() => {
                        this.$set(productModal, 'imageOnLoadErrorMsg', '');
                    })
                    .catch(() => {
                        this.$set(productModal, 'imageOnLoadErrorMsg', 'You may upload png or jpeg file 2MB max');
                    })
            },

            /**
             * Удаляет загруженный файл в input[type='file']
             * Очищает информацию о загруженном в input[type='file'] файле
             *
             */
            removeLoadImageHandler() {
                let inputValues = this.productModal.inputFieldsValue;
                let loadInfo = this.productModal.fileLoadInfo;

                this.$set(loadInfo, 'dir', null);
                this.$set(loadInfo, 'fileList', null);
                this.$set(loadInfo, 'fileReader', null);
                this.$set(loadInfo, 'isFlag', false);

                this.$set(inputValues, 'imageBase64', '');
                this.$set(inputValues, 'imageURL', '');
            },

            // CRUD МЕТОДЫ
            /**
             * Возвращает значение ключа в виде строки
             *
             * @param {String} path: путь к продукту в FBDatabase
             *
             * @return {String} FBDatabase product key
             *
             */
            getKeyInDBPath(path) {
                let loadInfo = this.productModal.fileLoadInfo;
                let routePath = `/${this.$route.name}/`;
                let startnum = path.indexOf(routePath) + routePath.length;
                let key = path.slice(startnum, path.length);

                this.$set(loadInfo, 'productFbId', key);
                return key;
            },

            /**
             * Запускает action удаления картинки
             * После выполняет обновление данных (editProduct)
             *
             * @param {Object} forRemoveData -
             * keys: editElement, imageName
             *
             * @actions {deleteImgFromFbStorage}
             *          {editProduct}
             *          {getProductList}
             *
             * @methods {closeModal}
             *
             */
            onDeleteImgFromFbStorage(forRemoveData) {
                let inputValues = this.productModal.inputFieldsValue;
                let loadInfo = this.productModal.fileLoadInfo;

                this.deleteImgFromFbStorage(forRemoveData)
                    .then(() => {
                        inputValues.imageName = '';
                        let updatedData = {
                            editedResults: cloneDeep(inputValues),
                            editElement: loadInfo.productFbId
                        };
                        this.editProduct(updatedData);
                    })
                    .then(() => {
                        this.closeModal();
                        this.getProductList();
                    });
            },

            /**
             * Возвращает имя картинки что была / небыла загружена в Storage
             * keys[i] - это ключ
             * obj[keys[i]] - а это свойство, доступное по этому ключу
             *
             * @param {Object} store - this.$store.state.products.
             *
             */
            getCurrentProduductFromStore(store, index) {
                let obj = store;
                let keys = Object.keys(obj);

                for (let i = 0, l = keys.length; i < l; i++) {
                    if (keys[i] === index) {
                        return obj[keys[i]]
                    }
                }
            },

            /**
             * Добавление продукта в FBDatabase,
             * загрузка картинки в FBStorage (если файл был выбран)
             *
             * @actions {addProduct}
             *          {loadImages}
             *          {editProduct}
             *          {getProductList}
             *
             * @methods {addProductFunc}
             *          {getKeyInDBPath}
             *          {closeModal}
             */
            onAddProduct() {
                let productModal = this.productModal;
                let inputValues = this.productModal.inputFieldsValue;
                let loadInfo = this.productModal.fileLoadInfo;

                this.$set(inputValues, 'id', '_' + Math.random().toString(36).substr(2, 9));
                this.$set(productModal.confirmChangesBtn, 'isDisabled', true);

                const addProductFunc = () => {
                    return new Promise((resolve, reject) => {
                        this.addProduct(productModal.inputFieldsValue)
                            .then((path) => {
                                return this.getKeyInDBPath(path);
                            })
                            .then((key) => {
                                console.log(key);
                                if (loadInfo.isFlag && loadInfo.productFbId !== null) {
                                    resolve(this.loadImages(loadInfo));
                                } else reject();
                            })
                    });
                };

                addProductFunc()
                    .then((url) => {
                        console.log(url);
                        if (url !== undefined) {
                            inputValues.imageURL = url;
                            let updatedData = {
                                editedResults: cloneDeep(inputValues),
                                editElement: loadInfo.productFbId
                            };
                            this.editProduct(updatedData);
                        }
                    })
                    .then(() => {
                        this.closeModal();
                        this.getProductList();
                    })
                    .catch(() => {
                        this.closeModal();
                        this.getProductList();
                    })
            },

            /**
             * Редактирование продукта в FBDatabase,
             * загрузка картинки в FBStorage (если файл был выбран)
             * удаление картинки если файл был удален
             *
             * @actions {loadImages}
             *          {editProduct}
             *
             *          {getProductList}
             *
             * @methods {closeModal}
             *          {onDeleteImgFromFbStorage}
             *
             */
            onEditProduct() {
                let productModal = this.productModal;
                let inputValues = this.productModal.inputFieldsValue;
                let loadInfo = this.productModal.fileLoadInfo;

                this.$set(productModal.confirmChangesBtn, 'isDisabled', true);

                if (loadInfo.isFlag) {
                    this.loadImages(loadInfo)
                        .then((url) => {
                            if (url !== undefined) {
                                inputValues.imageURL = url;
                                let updatedData = {
                                    editedResults: cloneDeep(inputValues),
                                    editElement: loadInfo.productFbId
                                };
                                this.editProduct(updatedData);
                            }
                        })
                        .then(() => {
                            this.closeModal();
                            this.getProductList();
                        })
                } else if (inputValues.imageName) {
                    let forRemoveData = {
                        editElement: loadInfo.productFbId,
                        imageName: inputValues.imageName
                    };
                    this.onDeleteImgFromFbStorage(forRemoveData)
                } else {
                    let updatedData = {
                        editedResults: cloneDeep(inputValues),
                        editElement: loadInfo.productFbId
                    };
                    this.editProduct(updatedData);
                    this.closeModal();
                    this.getProductList();
                }
            },

            /**
             * Удаление продуката (если есть загруженная картинка, то удаляет ее
             * по ключу из FBStorage) из FBDatabase
             *
             * @actions {deleteImgFromFbStorage}
             *          {removeProduct}
             *          {getProductList}
             *
             * @methods {getCurrentProduductFromStore}
             *          {closeRemoveModal}
             *
             */
            onRemoveProduct(index) {
                let forRemoveData = {
                    editElement: this.currentIdElement,
                    imageName: (this.getCurrentProduductFromStore(this.$store.state.products, index) || {}).imageName
                };
                if (forRemoveData.imageName) {
                    this.deleteImgFromFbStorage(forRemoveData);
                    this.removeProduct(index);
                    this.closeRemoveModal();
                    this.getProductList();
                } else {
                    this.removeProduct(index);
                    this.closeRemoveModal();
                    this.getProductList();
                }
            },

            /**
             * В зависимости от статуса при котором было открыто модальное окно
             * выполняет создание / ркдактирование продукта
             *
             * @methods {onAddProduct}
             *          {onEditProduct}
             *
             */
            onConfirmChanges() {
                let status = this.productModal.status;
                this.$validator.validateAll()
                    .then((result) => {
                        if (result && status === 'create')
                            this.onAddProduct();
                        if (result && status === 'edit')
                            this.onEditProduct();
                    })
                    .catch((error) => error);
            }
        },
        created() {
            this.getProductList();
        }
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
