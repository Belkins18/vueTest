<template>
    <div class="products">
        <div class='container'>
            <button type="button" class="btn btn-secondary createProduct" @click="showModal = true">Create New Product</button>
            <table class="table">
                <thead>
                <tr>
                    <th v-for="(item, index) in thead" :key='index'>{{item}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in tbody.items" :key='index'>
                    <td>
                        {{ item.id }}
                    </td>
                    <td>
                        <img :src='item.img.src' :alt='item.img.alt' :width='item.img.size.w'>
                    </td>
                    <td>{{item.sku}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.purchasePrice}}</td>
                    <td>{{item.price}}</td>
                    <td>{{item.stock}}</td>
                    <td>{{item.actions}}</td>
                </tr>
                </tbody>
            </table>
            <Modal v-if="showModal" @close="showModal = false">
                <span slot="modal-header">Create New Product</span>
                <div slot="modal-body">
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_sku">SKU</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="tbody.itemElements.itemSKU" placeholder="SKU" class="form-control" id="product_sku" aria-describedby="product_skuHelp">
                            <small id="product_skuHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_name">Name</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="tbody.itemElements.itemName" placeholder="Name" class="form-control" id="product_name" aria-describedby="product_nameHelp">
                            <small id="product_nameHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_stock">Stock</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="tbody.itemElements.itemStock" placeholder="Stock" class="form-control" id="product_stock" aria-describedby="product_stockHelp">
                            <small id="product_stockHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_purprice">Purchase Price</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="tbody.itemElements.itemPurchasePrice" placeholder="Purchase Price" class="form-control" id="product_purprice" aria-describedby="product_purpriceHelp">
                            <small id="product_purpriceHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label" for="product_price">Price</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="tbody.itemElements.itemPrice" placeholder="Price" class="form-control" id="product_price" aria-describedby="product_priceHelp">
                            <small id="product_priceHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
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

            <!--<div class="row">-->
                <!--<div class="col-sm-6 col-xs-10 col-sm-offset-3 col-xs-offset-1">-->
                    <!--<div class="modal-content">-->
                        <!--<div class="modal-header">-->
                            <!--<h4 class="modal-title text-center" id="myModalLabel">Create New Product</h4>-->
                        <!--</div>-->
                        <!--<div class="modal-body">-->
                            <!--<form class="form-horizontal">-->
                                <!--&lt;!&ndash;<div class="form-group">&ndash;&gt;-->
                                    <!--&lt;!&ndash;<label for="login_username" class="col-sm-4 control-label">SKU</label>&ndash;&gt;-->
                                    <!--&lt;!&ndash;<div class="col-sm-8">&ndash;&gt;-->
                                        <!--&lt;!&ndash;<input type="text" v-model="tbody.itemElements.itemSKU" placeholder="SKU">&ndash;&gt;-->
                                    <!--&lt;!&ndash;</div>&ndash;&gt;-->
                                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                                <!--&lt;!&ndash;<div class="form-group">&ndash;&gt;-->
                                    <!--&lt;!&ndash;<label for="login_username" class="col-sm-4 control-label">Name</label>&ndash;&gt;-->
                                    <!--&lt;!&ndash;<div class="col-sm-8">&ndash;&gt;-->
                                        <!--&lt;!&ndash;<input type="text" v-model="tbody.itemElements.itemName" placeholder="Name">&ndash;&gt;-->
                                    <!--&lt;!&ndash;</div>&ndash;&gt;-->
                                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                                <!--&lt;!&ndash;<div class="form-group">&ndash;&gt;-->
                                    <!--&lt;!&ndash;<label for="login_username" class="col-sm-4 control-label">Stock</label>&ndash;&gt;-->
                                    <!--&lt;!&ndash;<div class="col-sm-8">&ndash;&gt;-->
                                        <!--&lt;!&ndash;<input type="text" v-model="tbody.itemElements.itemStock" placeholder="Stock">&ndash;&gt;-->
                                    <!--&lt;!&ndash;</div>&ndash;&gt;-->
                                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                                <!--&lt;!&ndash;<div class="form-group">&ndash;&gt;-->
                                    <!--&lt;!&ndash;<label for="login_username" class="col-sm-4 control-label">Purchase Price</label>&ndash;&gt;-->
                                    <!--&lt;!&ndash;<div class="col-sm-8">&ndash;&gt;-->
                                        <!--&lt;!&ndash;<input type="text" v-model="tbody.itemElements.itemPurchasePrice"&ndash;&gt;-->
                                               <!--&lt;!&ndash;placeholder="Purchase Price">&ndash;&gt;-->
                                    <!--&lt;!&ndash;</div>&ndash;&gt;-->
                                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                                <!--&lt;!&ndash;<div class="form-group">&ndash;&gt;-->
                                    <!--&lt;!&ndash;<label for="login_username" class="col-sm-4 control-label">Price</label>&ndash;&gt;-->
                                    <!--&lt;!&ndash;<div class="col-sm-8">&ndash;&gt;-->
                                        <!--&lt;!&ndash;<input type="text" v-model="tbody.itemElements.itemPrice" placeholder="Price">&ndash;&gt;-->
                                    <!--&lt;!&ndash;</div>&ndash;&gt;-->
                                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                                <!--<div class="form-group">-->
                                    <!--<div class="col-sm-offset-4 col-sm-8">-->
                                        <!--<input-->
                                                <!--type='submit'-->
                                                <!--value='Save'-->
                                                <!--@click.prevent='addItem'-->
                                        <!--/>-->
                                    <!--</div>-->
                                <!--</div>-->
                            <!--</form>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
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
                    items: [
                        {
                            id: 1,
                            sku: "24-M-203",
                            img: {
                                src: "https://www.freeiconspng.com/uploads/img-landscape-photo-photography-picture-icon-12.png",
                                alt: "",
                                size: {
                                    w: "20px"
                                }
                            },
                            name: 'Кружка 320мл "Я Люблю С++"',
                            purchasePrice: "20.00",
                            price: "28.99",
                            stock: 23,
                            actions: "Actions"
                        }
                    ],
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
                        itemActions: 'Actions'
                    }
                }
            };
        },
        created() {
            this.$store.dispatch('initDataBase');
        },
    };
</script>

<style scoped lang="scss">
    .products {
        margin-top: 60px;
        padding-top: 50px;
    }

    .createProduct{
        margin-bottom: 30px;
    }

</style>
