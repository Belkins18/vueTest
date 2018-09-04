<template>
    <div class="products">
        <div class='container'>
            <button>Create New Product</button>

            <table class="table table-bordered">
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

            <div class="row">
                <div class="col-sm-6 col-xs-10 col-sm-offset-3 col-xs-offset-1">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title text-center" id="myModalLabel">Create New Product</h4>
                        </div>
                        <div class="modal-body">
                            <form class="form-horizontal">
                                <div class="form-group">
                                    <label for="login_username" class="col-sm-4 control-label">SKU</label>
                                    <div class="col-sm-8">
                                        <input type="text" v-model="tbody.itemElements.itemSKU" placeholder="SKU">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="login_username" class="col-sm-4 control-label">Name</label>
                                    <div class="col-sm-8">
                                        <input type="text" v-model="tbody.itemElements.itemName" placeholder="Name">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="login_username" class="col-sm-4 control-label">Stock</label>
                                    <div class="col-sm-8">
                                        <input type="text" v-model="tbody.itemElements.itemStock" placeholder="Stock">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="login_username" class="col-sm-4 control-label">Purchase Price</label>
                                    <div class="col-sm-8">
                                        <input type="text" v-model="tbody.itemElements.itemPurchasePrice" placeholder="Purchase Price">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="login_username" class="col-sm-4 control-label">Price</label>
                                    <div class="col-sm-8">
                                        <input type="text" v-model="tbody.itemElements.itemPrice" placeholder="Price">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="col-sm-offset-4 col-sm-8">
                                        <input
                                                type='submit'
                                                value='Save'
                                                @click.prevent='addItem'
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "products",
        data() {
            return {
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

    * + table {
        margin-top: 30px;
    }
    table + * {
        margin-top: 50px;
    }
</style>
