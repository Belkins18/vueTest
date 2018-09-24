<template>
    <div v-if="responsive" :class="[{'table-responsive-lg': table-responsive}]">
        <table
                class="table"
                :class="[
                {
                    'table-dark': darkTheme,
                    'table-hover': tableHover,
                    'table-striped': striped,
                    'table-bordered': bordered,
                    'table-borderless': borderless,
                }
           ]">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
            </tr>
            <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
            </tr>
            <tr>
                <th scope="row">3</th>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
            </tr>
            </tbody>
        </table>
    </div>
    <div v-else>
        <table
                class="table"
                :class="[
                {
                    'table-dark': darkTheme,
                    'table-hover': tableHover,
                    'table-striped': striped,
                    'table-bordered': bordered,
                    'table-borderless': borderless,
                }
           ]">
            <thead>
            <tr>
                <th v-for="(item, index) in tableData.columns" :key='index'>{{item}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(product, index) in tableData.rows" :key='product.id'>
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
                    <Button classes="products__btn"
                            type="info"
                            icon="pencil"
                            @click="editProductHandler(product, index)"
                            :circle="true">
                    </Button>

                    <Button classes="products__btn"
                            type="danger"
                            icon="trash"
                            :circle="true"
                            @click="confirmModalHandler(index)">
                    </Button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: "Table",
        data() {
            return {
                tableData: {
                    columns: [],
                    rows: []
                }
            }
        },
        props: {
            darkTheme: {
                type: Boolean,
                default: false
            },
            striped: {
                type: Boolean,
                default: false
            },
            bordered: {
                type: Boolean,
                default: false
            },
            borderless: {
                type: Boolean,
                default: false
            },
            tableHover: {
                type: Boolean,
                default: false
            },
            responsive: {
                type: Boolean,
                default: false
            },
            classes: {
                type: String,
                default: ''
            },
        },
    }
</script>

<style scoped>

</style>