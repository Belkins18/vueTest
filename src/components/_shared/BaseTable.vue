<template>
    <div v-if="responsive" :class="[classes ? `${classes}`: '', {'table-responsive': responsive}]">
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
                <slot name="tableHead"></slot>
            </thead>
            <tbody>
                <slot name="tableBody"></slot>
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

<style scoped lang="scss">
    .table-responsive {
        table {
            min-width: $table-min-width;
            box-shadow: $el-box-shadow;
        }
        tr > td {
            vertical-align: middle;
        }
    }
</style>