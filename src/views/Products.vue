<template>
    <div class="products">
        <div class='container'>
            <button type="button" class="btn btn-secondary createProduct products__btn products__btn--showModal "
                    @click="showModal = true">Create New Product
            </button>
            <div class="products__table table-responsive">
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th v-for="(item, index) in thead" :key='index'>{{item}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in products" :key='index'>
                        <td>{{ item.id }}</td>
                        <td>{{ item.sku }}</td>
                        <td>
                            <!--<img :src='item.img.src' :alt='item.img.alt' :width='item.img.size.w'>-->
                            <img
                                    src='https://www.freeiconspng.com/uploads/img-landscape-photo-photography-picture-icon-12.png'
                                    alt=''
                                    width='20px'>
                        </td>
                        <td>{{item.name}}</td>
                        <td>{{item.purchasePrice}}</td>
                        <td>{{item.price}}</td>
                        <td>{{item.stock}}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-edit" @click="showModal = true">
                                <span class="oi oi-pencil"></span>
                            </button>
                            <button type="button" class="btn btn-primary btn-edit" @click="showModal = true">
                                <span class="oi oi-trash"></span>
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <Modal v-if="showModal" @close="showModal = false">
                <span slot="modal-header">Create New Product</span>
                <div slot="modal-body">
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_sku">SKU</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="tbody.itemElements.itemSKU" placeholder="SKU"
                                   class="form-control" id="product_sku" aria-describedby="product_skuHelp">
                            <small id="product_skuHelp" class="form-text text-muted">We'll never share your email with
                                anyone else.
                            </small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_name">Name</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="tbody.itemElements.itemName" placeholder="Name"
                                   class="form-control" id="product_name" aria-describedby="product_nameHelp">
                            <small id="product_nameHelp" class="form-text text-muted">We'll never share your email with
                                anyone else.
                            </small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_stock">Stock</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="tbody.itemElements.itemStock" placeholder="Stock"
                                   class="form-control" id="product_stock" aria-describedby="product_stockHelp">
                            <small id="product_stockHelp" class="form-text text-muted">We'll never share your email with
                                anyone else.
                            </small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_purprice">Purchase Price</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="tbody.itemElements.itemPurchasePrice"
                                   placeholder="Purchase Price" class="form-control" id="product_purprice"
                                   aria-describedby="product_purpriceHelp">
                            <small id="product_purpriceHelp" class="form-text text-muted">We'll never share your email
                                with anyone else.
                            </small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_price">Price</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="tbody.itemElements.itemPrice" placeholder="Price"
                                   class="form-control" id="product_price" aria-describedby="product_priceHelp">
                            <small id="product_priceHelp" class="form-text text-muted">We'll never share your email with
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
            </Modal>


        </div>
    </div>
</template>

<script>
    import Modal from "@/components/Modal.vue";


    export default {
        name: "products",
        components: {
            Modal
        },
        data() {
            return {
                showModal: false,
                thead: ['id', 'SKU', 'Image', 'Name', 'Purchase Price', 'Price', 'Stock', 'Actions'],
                tbody: {

                    itemElements: {
                        itemId: Number,
                        itemSKU: '',
                        itemImg: {
                            src: "https://www.freeiconspng.com/uploads/img-landscape-photo-photography-picture-icon-12.png", //base64
                            alt: "",
                            size: {
                                w: "20px"
                            }
                        },
                        itemName: '',
                        itemStock: '',
                        itemPurchasePrice: '',
                        itemPrice: '',
                    }
                }
            };
        },
        computed: {
            products() {
                return this.$store.state.products;
            }
        },
        methods: {
            dataTable() {
                this.$store.dispatch('getProd').then((data) => {
                    console.log(data);
                });
            }
        },
        created() {
            this.dataTable();
            // this.$store.getters.getDBFirebaseProd.once("value")
            //     .then((snapshot) => {
            //         console.log(snapshot.val());
            //     })
            //     .catch((error) => {
            //         console.log(error.message);
            //     });

            // console.log(this.dataTable().then((data) => console.log(data)));
            // return new Promise((resolve, reject) => {
            //     this.$store.getters.getDBFirebaseProd.once("value")
            //         .then(function (snapshot) {
            //             let value = snapshot.val();
            //             let key = snapshot.key;
            //             console.log(key);
            //             console.log(value);
            //             resolve(value);
            //         })
            //         .catch((error) => {
            //             console.log(error.message);
            //             reject();
            //         });
            // });
            // this.$store.getters.getDBFirebaseProd.once("value")
            //     .then( function (snapshot) {
            //         let value = snapshot.val();
            //         let key = snapshot.key;
            //         console.log(key);
            //         console.log(value);
            //         return value;
            //     });


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
