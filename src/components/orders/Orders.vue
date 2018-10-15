<template>
	<div class="orders">
		<div class='container'>
			<BaseButton
					classes="createOrder orders__btn orders__btn--showModal"
					type="secondary"
					@click="createOrdersHandler">
				Create New Order
			</BaseButton>

			<BaseTable
					classes="orders__table"
					:responsive="table.isResponsive">
				<tr slot="tableHead">
					<th v-for="(headName, index) in table.data.headNames" :key='index'>{{headName}}</th>
				</tr>
				<tr v-for="(order, index) in orders" :key='order.id' slot="tableBody">
					<td>{{ order.id }}</td>
					<td>{{ order.dateFormat }}</td>
					<td>
						<ul class="orders__product-list productList">
							<li v-for="product in order.productList" :key='product.selected.id'
								class="productList__item">
								<span class="productList__val">{{ product.selected.text }} <small>x</small> {{ product.productCount }}</span>
								<span class="productList__cur">({{'₴ ' + parseInt(product.selected.price, 10) * parseInt(product.productCount, 10) }})</span>
							</li>
						</ul>
					</td>
					<td>{{ order.clientName }}</td>
					<td>{{ order.phone }}</td>
					<td>{{ order.total }}</td>
					<td>{{ order.checkboxPaid }}</td>
					<td>{{ order.checkboxSent }}</td>
					<td>
						<div style="display: flex; align-items: center">
							<BaseButton
									classes="orders__btn"
									type="info"
									icon="pencil"
									@click="editOrderHandler(order, index)"
									:circle="true">
							</BaseButton>

							<BaseButton
									classes="orders__btn"
									type="danger"
									icon="trash"
									:circle="true"
									@click="removeOrderHandler(index)">
							</BaseButton>
						</div>
					</td>
				</tr>
			</BaseTable>

			<BaseModal
					@close="closeModal"
					classes="orders__modal"
					:isVisible.sync="orderModal.isVisible"
					:title="(orderModal.status === 'edit' ? 'Edit order' : orderModal.status === 'create' ? 'Create order' : null)">
				<div slot="modal-body">
					<form autocomplete="off">
						<input autocomplete="false" name="hidden" type="text" style="display:none;">
						<div class="form-group row">
							<label class="col-sm-2 col-form-label">Date</label>
							<div class="col-sm-10">
								<Datepicker
										name="datepicker"
										:class="{'is-invalid': errors.has('datepicker')}"
										:input-class="{'form-control': true, 'is-invalid': errors.has('datepicker')}"
										:disabledDates="state.disabledDates"
										:format="'yyyy-MM-dd'"
										v-validate="'required'"
										v-model="orderModal.formFields.date">
								</Datepicker>
								<small class="invalid-feedback"> {{ errors.first('datepicker') }}</small>
							</div>
						</div>
						<div class="form-group ">
							<div class="row">
								<label class="col-sm-2 col-form-label">Product</label>
								<transition-group name='bounce' tag='ul' class="productList col-sm-10">
									<li class='productList__item'
										v-for='(item, index) in orderModal.formFields.productList'
										:key='item + "__" + index'>
										<div class="input-group" :data-index="index">
											<div class="input-group__select-wraper">
												<Multiselect
														class="multiselect_order"
														:class="{'hasError': errors.has('multiselect_'+ index) }"
														v-model="item.selected"
														v-validate="'required'"
														:name="'multiselect_' + index"
														:options="options"
														:close-on-select="true"
														:clear-on-select="false"
														placeholder="Select one"
														:aria-describedby="'multiselectHelp_' + index"
														label="text"
														track-by="text">
												</Multiselect>
												<small :id="'multiselectHelp_'+ index" class="invalid-feedback">{{
													errors.first('multiselect_'+ index)}}
												</small>
											</div>
											<div class="input-group-append">
												<input
														type="text"
														placeholder="Count"
														:class="{'form-control': true, 'is-invalid': errors.has('productCount_'+ index) }"
														:name="'productCount_'+ index"
														:aria-describedby="'productCountHelp_'+ index"
														v-validate="'required|numeric|min_value:1'"
														v-model="item.productCount">
											</div>
											<BaseButton
													classes="productList__removeBtn"
													type="danger"
													icon="trash"
													:square="true"
													:disabled="ordersProductsList < 2"
													@click="removeProductWithOrdersProductListHandler(index)">
											</BaseButton>
										</div>
										<small class="invalid-feedback"> {{ errors.first('productCount_'+ index) }}
										</small>
									</li>
								</transition-group>
							</div>
							<div class="row">
								<div class="col-sm-10 offset-sm-2 ">
									<BaseButton
											classes=""
											:block="true"
											:outline="true"
											type="info"
											:disabled="ordersProductsList >= Object.keys(this.products).length"
											@click="addProductInOrdersProductListHandler">
										Add One More Product
									</BaseButton>
								</div>
							</div>
						</div>
						<div class="form-group row">
							<label class="col-sm-2 col-form-label" for="oreder_clientName">Client Name</label>
							<div class="col-sm-10">
								<input
										name="clientName"
										v-model="orderModal.formFields.clientName"
										v-validate="'required|alpha_spaces'"
										:class="{'form-control': true, 'is-invalid': errors.has('clientName') }"
										id="oreder_clientName" type="text" placeholder="Name">
								<small class="invalid-feedback"> {{ errors.first('clientName') }}</small>
							</div>
						</div>
						<div class="form-group row">
							<label class="col-sm-2 col-form-label" for="oreder_phone">Phone</label>
							<div class="col-sm-10">
								<MaskedInput
										v-model="orderModal.formFields.phone"
										name="phone"
										mask="\+\8 (111) 111-1111"
										:class="{'is-invalid': errors.has('phone')}"
										class="form-control"
										v-validate:phoneNumber="'min:12'"
										placeholder-char="_"
										placeholder="Phone number"
										id="oreder_phone"
										type="tel">
								</MaskedInput>
								<small class="invalid-feedback"> {{ errors.first('phone') }}</small>
							</div>
						</div>
						<div class="form-group row">
							<div class="col-sm-10 offset-sm-2">
								<ul class="checkboxList">
									<li class="checkboxList__item">
										<BaseCheckbox
												id='checkboxPaid'
												name="checkboxPaid"
												aria-describedby="checkboxPaidHelp"
												:isMargin="false"
												v-model="orderModal.formFields.checkboxPaid">Paid
										</BaseCheckbox>
										<small id="checkboxPaidHelp" class="checkboxList__error invalid-feedback"> {{
											errors.first('checkboxPaid') }}
										</small>
									</li>
									<li class="checkboxList__item">
										<BaseCheckbox
												id='checkboxSent'
												name="checkboxSent"
												aria-describedby="checkboxSentHelp"
												:isMargin="false"
												v-model="orderModal.formFields.checkboxSent">Sent
										</BaseCheckbox>
										<small id="checkboxSentHelp" class="checkboxList__error invalid-feedback"> {{
											errors.first('checkboxSent') }}
										</small>
									</li>
								</ul>
							</div>
						</div>
					</form>
				</div>

				<div slot="modal-footer" class="btn-group">
					<BaseButton type="primary"
								:outline="true"
								@click="closeModal">Cancel
					</BaseButton>
					<BaseButton type="secondary"
								:outline="true"
								:disabled="orderModal.confirmChangesBtn.isDisabled"
								@click="onConfirm()"> Accept
					</BaseButton>
				</div>
			</BaseModal>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import VeeValidate from 'vee-validate';
	import MaskedInput from 'vue-masked-input'
	import Multiselect from 'vue-multiselect';
	import Datepicker from 'vuejs-datepicker';
	import {mapActions} from 'vuex';
	// import {cloneDeep} from "lodash";

	import BaseButton from '@/components/_shared/BaseButton';
	import BaseTable from '@/components/_shared/BaseTable';
	import BaseModal from '@/components/_shared/BaseModal';
	import BaseSelect from '@/components/_shared/BaseSelect';
	import BaseCheckbox from '@/components/_shared/BaseCheckbox';

	Vue.use(VeeValidate);
	VeeValidate.Validator.extend('truthy', {
		getMessage: field => 'The ' + field + ' value is not truthy.',
		validate: value => !!value
	});
	VeeValidate.Validator.extend('notZero', {
		getMessage: field => 'The ' + field + ' value must be more then 0',
		validate(value) {
			return value > 0
		}
	});
	VeeValidate.Validator.extend('isBigger', (value, [otherValue]) => {
		return value > otherValue;
	}, {
		hasTarget: true
	});
	VeeValidate.Validator.extend('isSmaller', (value, [otherValue]) => {
		return value < otherValue;
	}, {
		hasTarget: true
	});

	export default {
		name: "Orders",
		components: {
			BaseButton,
			BaseTable,
			BaseModal,
			BaseSelect,
			Multiselect,
			BaseCheckbox,
			MaskedInput,
			Datepicker,
		},
		data() {
			return {
				options: [],
				orderModal: {
					data: {},
					isVisible: false,
					confirmChangesBtn: {
						isDisabled: false,
					},
					status: '',
					formFields: {
						date: null,
						dateFormat: '',
						id: '',
						key: '',
						clientName: '',
						phone: '',
						checkboxPaid: false,
						checkboxSent: false,
						productList: [],
					},
				},
				table: {
					isResponsive: true,
					data: {
						headNames: ['id', 'Date', 'Products', 'Client Name', 'Phone', 'Total', 'Paid', 'Sent', 'Actions'],
						bodyContent: [
							{
								id: 1,
								date: '2025-04-01',
								clientName: 'Belibov Nikolay',
								phone: '(067) 12 34 567',
								total: '2340,00',
								paid: true,
								sent: false
							},
						],

					}
				},
				state: {
					disabledDates: {
						to: new Date(2018, 9, 12), // Disable all dates up to specific date
						// from: new Date(2016, 0, 26), // Disable all dates after specific date
						// days: [6, 0], // Disable Saturday's and Sunday's
						// daysOfMonth: [29, 30, 31], // Disable 29th, 30th and 31st of each month
						// dates: [ // Disable an array of dates
						// 	new Date(2016, 9, 16),
						// 	new Date(2016, 9, 17),
						// 	new Date(2016, 9, 18)
						// ],
						// ranges: [{ // Disable dates in given ranges (exclusive).
						// 	from: new Date(2016, 11, 25),
						// 	to: new Date(2016, 11, 30)
						// }, {
						// 	from: new Date(2017, 1, 12),
						// 	to: new Date(2017, 2, 25)
						// }],
						// // a custom function that returns true if the date is disabled
						// // this can be used for wiring you own logic to disable a date if none
						// // of the above conditions serve your purpose
						// // this function should accept a date and return true if is disabled
						// customPredictor: function (date) {
						// 	// disables the date if it is a multiple of 5
						// 	if (date.getDate() % 7 == 0) {
						// 		return true
						// 	}
						// }
					}
				}
			}
		},
		// watch: {
		//     products() {
		//         // this.$refs.baseselect = this.products;
		//         // console.log(this.$refs.baseselect.$options.propsData.options = this.products);
		//         this.$refs.baseselect.options = this.products;
		//     }
		// },
		mounted() {
		},
		computed: {
			products() {
				return this.$store.state.products;
			},
			orders() {
				return this.$store.state.orders;
			},
			ordersProductsList() {
				let items = this.orderModal.formFields.productList;
				return items.length
			},
			dateFormat() {
				let date = this.orderModal.formFields.date;
				return {
					toString: date.toString(),
					toDate: date.toDateString(),
					toISO: date.toISOString(),
					toJSON: date.toJSON(),
					toLocaleDate: date.toLocaleDateString(),
					toLocaleTime: date.toLocaleTimeString(),
					toTime: date.toTimeString(),
					toUTC: date.toUTCString(),
				}
			},
			phoneNumber() {
				if (this.orderModal.formFields.phone) {
					return this.orderModal.formFields.phone.replace(/[^0-9a-zA-Z+]/g, '')
				}
			},

		},
		methods: {
			...mapActions([
				'createOrder',
				'editOrder',
				'getProductList',
				'getOrderList',
			]),
			formatOptions(options, newData) {
				let parseData = JSON.parse(JSON.stringify(options));
				let normalData = Object.values(parseData);
				normalData.forEach((element) => {
					newData.push({
						key: element.key,
						id: element.id,
						image: element.imageURL,
						text: element.name,
						stock: element.stock,
						price: element.price
					})
				});
			},
			// ОТКРыВАНИЕ МОДАЛЬНыХ ОКОН
			/**
			 * Открывает модальное окно создания ордера
			 *
			 */
			createOrdersHandler() {
				let orderModal = this.orderModal;

				this.formatOptions(this.products, this.options);

				orderModal.status = 'create';
				orderModal.isVisible = true;
				orderModal.formFields.productList = [{}];

				console.log(this.products);
			},
			editOrderHandler() {

			},
			removeOrderHandler() {

			},

			addProductInOrdersProductListHandler() {
				let items = this.orderModal.formFields.productList;
				items.push({});
			},
			removeProductWithOrdersProductListHandler(index) {
				console.log(index);
				let items = this.orderModal.formFields.productList;
				items.splice(index, 1);
			},

			closeModal() {
				let orderModal = this.orderModal;
				let formFields = this.orderModal.formFields;
				this.options = [];

				orderModal.isVisible = false;
				orderModal.confirmChangesBtn.isDisabled = false;
				orderModal.status = '';
				orderModal.data = {};

				formFields.id = '';
				formFields.key = '';
				formFields.date = null;
				formFields.dateFormat = '';
				formFields.clientName = '';
				formFields.phone = '';
				formFields.checkboxPaid = false;
				formFields.checkboxSent = false;
				formFields.productList = [{}];
			},

			getNthParent(elem, n) {
				return n === 0 ? elem : this.getNthParent(elem.parentNode, n - 1);
			},
			getKeyInDBPath(path) {
				let routePath = `/${this.$route.name}/`;
				let startnum = path.indexOf(routePath) + routePath.length;
				let key = path.slice(startnum, path.length);

				return key;
			},
			hasDuplicate(values) {
				let isDuplicate = false;

				values
					.map(v => v.selected)
					.sort()
					.sort((a, b) => {
						if (a === b)
							return isDuplicate = true
					});

				return isDuplicate;
			},
			/*
			calculateTotal(key) {
				let formFields = this.orderModal.formFields;
				let total = (count, price) => count * price;

				this.getOrderList()
					.then(() => {
						let array = this.orders[key].productList;
						const sum = (...values) => {
							return values.reduce((total, value) => {
								return total + value;
							}, 0);
						};

						array.forEach((order) => {
							let productObj;

							Object.values(JSON.parse(JSON.stringify(this.products)))
								.forEach((product) => {
									if (product.id === order.selected) {
										productObj = {
											productKey: product.key,
											productPrice: product.price,
											productStock: product.stock,
										};
										return productObj;
									}
								});

							console.log(sum(...total(order.productCount, productObj.productPrice)));

						});
						// this.$set(formFields, 'total', total(order.productCount, productObj.productPrice));

						// let updatedData = {
						//     editedResults: cloneDeep(formFields),
						//     editElement:  key
						// };
						//
						// this.editOrder(updatedData)
					});
			},
			*/

			onCreateOrder() {
				console.log("allGood");
				let orderModal = this.orderModal;
				let formFields = this.orderModal.formFields;

				formFields.id = 'order@_' + Math.random().toString(36).substr(2, 6);
				formFields.dateFormat = this.dateFormat.toLocaleDate;
				orderModal.confirmChangesBtn.isDisabled = true;
				debugger;

				this.createOrder(formFields)
					.then((path) => {
						return this.getKeyInDBPath(path);
					})
					.then((key) => {
						this.$set(formFields, 'key', key);

						// let updatedData = {
						// 	editedResults: cloneDeep(formFields),
						// 	editElement: formFields.key
						// };

						// this.editOrder(updatedData)
						// 	.then(() => {
						// 		this.calculateTotal(key);
						// 	});

						return key;
					})

				// console.log(Object.values(JSON.parse(JSON.stringify(this.products))));
			},
			onEditOrder() {

			},

			/**
			 * В зависимости от статуса при котором было открыто модальное окно
			 * выполняет создание / ркдактирование заказа
			 *
			 * @methods {onCreateOrder}
			 *          {onEditOrder}
			 *
			 */
			onConfirm() {
				let status = this.orderModal.status;
				let vm = this;

				this.$validator.validateAll()
					.then((result) => {
						let inputGroup = document.querySelectorAll('.productList .input-group');
						let selectList = document.querySelectorAll('.productList .input-group .multiselect');

						if (this.hasDuplicate(this.orderModal.formFields.productList) === true || this.errors.items.length !== 0) {
							(this.hasDuplicate(this.orderModal.formFields.productList) === true)
								? (
									selectList.forEach((item) => {
										item.classList.add('is-invalid')
									}))
								: (
									selectList.forEach((item) => {
										item.classList.remove('is-invalid')
									}));

							if (this.errors.items.length !== 0)
								selectList.forEach((item, index) => {
									if (item.classList.contains('hasError'))
										selectList[index].classList.add('is-invalid');
								});

							inputGroup.forEach((item) => {
								let input = item.querySelector('.input-group-append > input');

								(input.classList.contains('is-invalid'))
									? this.getNthParent(input, 2).classList.add('is-invalid')
									: this.getNthParent(input, 2).classList.remove('is-invalid')
							});
						} else {
							if (result && status === 'create') {
								let error = false;

								inputGroup.forEach((item) => {
									let input = item.querySelector('.input-group-append > input');
									let stock = vm.$data.orderModal.formFields.productList[item.dataset.index].selected.stock;


									console.log(input);
									console.log(input.value);
									console.log(stock);
									debugger;
									while (error !== true) {
										debugger;

										if (parseInt(input.value) <= parseInt(stock)) {
											this.getNthParent(input, 2).classList.remove('is-invalid');
											debugger;
											return error = true;
										} else {
											this.getNthParent(input, 2).classList.add('is-invalid');
											debugger;
											return error = false;
										}
									}
								});
								debugger;
								if (error) {
									this.onCreateOrder();
								}
							}

							if (result && status === 'edit')
								this.onEditOrder();
						}
					});
			}

		},
		created() {
			this.getProductList();
			this.getOrderList();
		},
	}
</script>

<style scoped lang="scss">
	.orders {
		margin-top: 56px;
		padding-top: 50px;
		&__btn {
			&--showModal {
				margin-bottom: 30px;
			}
		}
		&__btn + &__btn {
			margin: rem(5);
		}
	}

	.table {
		.productList {
			margin: 0;
			padding: 0;
		}
	}

	.btn.square {
		@include is-circle(38, 1);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		border-radius: 0;
		> .oi {
			left: 1px;
			top: initial;
		}
	}

	.modal {
		.input-group {
			display: flex;
			flex-wrap: nowrap;
			input {
				border-radius: 0;
			}
			&.is-invalid {
				~ .invalid-feedback {
					display: block;
				}
			}
			.input-group-append {
				flex-wrap: wrap;
				flex-shrink: 0;
				width: rem(100);
				z-index: 1;
			}
		}
		.input-group {
			&__select-wraper {
				width: calc(100% - 138px);
			}
		}
	}

	.productList {
		&__item {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			/*flex-direction: column;*/
		}
		&__val {
			display: inline-flex;
			align-items: center;
			small {
				display: inline-flex;
				line-height: 1;
				font-size: rem(10);
				margin: 0 rem(2);
			}
		}
		&__cur {
			font-size: rem(12);
			color: $gray-400;
		}
		* + &__cur {
			margin-left: rem(5);
		}
		&__item + &__item {
			margin-top: rem(5);
		}
	}

	.checkboxList {
		list-style: none;
		padding: 0;
		margin: 0;
		&__item {
			display: flex;
			flex-direction: column;
			align-items: baseline;
		}

		&__item + &__item {
			margin-top: rem(8);
		}
	}

	.multiselect {
		@include m('order') {
			&.multiselect {
				box-sizing: border-box;
				min-height: rem(38);
			}

			& /deep/ .multiselect {
				&__tags {
					display: flex;
					align-items: center;
					padding: rem(10) rem(30) 0 rem(15);
					height: rem(38);
					min-height: initial;
					color: $gray-700;
					background-color: $white;
					border: 1px solid $gray-400;
					border-radius: rem(5);
					border-top-right-radius: 0;
					border-bottom-right-radius: 0
				}
				&__select {
					position: absolute;
					padding: 0;
					width: rem(26);
					height: rem(38);
					right: 1px;
					top: 50%;
					transform: translateY(-50%);
					&:before {
						top: rem(24);
					}
				}
				&__placeholder {
					font-size: initial;
				}
				&__single,
				&__input {
					padding-left: 0;
				}

				&__content {
					font-size: rem(12);
				}
				&__option {
					&:after {
						font-size: rem(10);
					}
				}
			}
		}
	}

	.multiselect.hasError.is-invalid {
		& /deep/ .multiselect__tags {
			border-color: $red;
		}
		~ .invalid-feedback {
			display: block;
		}
	}

	.multiselect.multiselect--active {
		& /deep/ .multiselect__tags {
			border-bottom-left-radius: 0
		}
	}

	.vdp-datepicker.is-invalid ~ .invalid-feedback {
		display: block;
	}

</style>