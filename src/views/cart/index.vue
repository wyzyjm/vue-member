<template>
	<div class="app-container">
		<page-title :pagetitle="title"> </page-title>
		<div v-if="cartList.length > 0 || unvalidList.length > 0">
			<div class="cartList">
				<div v-if="cartList.length > 0">
					<el-table
						ref="cartList"
						:data="cartList"
						class="productTable"
						@selection-change="selectProductFun"
					>
						<el-table-column
							type="selection"
							width="40"
							class-name="checkboxTd"
							align="center"
						></el-table-column>
						<el-table-column label="商品信息">
							<template slot-scope="scope">
								<div class="product">
									<div class="productImg">
										<custom-img
											:src="scope.row.skuImg"
										></custom-img>
									</div>
									<div class="productInfo">
										<p class="title">
											{{ scope.row.skuName }}
										</p>
										<p class="text-grey spec">
											<span
												class="specItem"
												v-for="(item, index) in scope
													.row.skuSpec"
												:key="index"
											>
												{{ item.specName }} :
												{{ item.specValue }}；
											</span>
										</p>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="skuName"
							label="单价"
							width="150"
							align="center"
						>
							<template slot-scope="scope">
								<span class="strongMark">
									{{ data.currencySymbol }}
									{{ scope.row.price }}
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="skuName"
							label="数量"
							width="150"
							align="center"
						>
							<template slot-scope="scope">
								<el-input-number
									v-model="scope.row.quantity"
									:step="1"
									step-strictly
									size="small"
								></el-input-number>
							</template>
						</el-table-column>
						<el-table-column
							prop="skuName"
							label="小计"
							width="150"
							align="center"
						>
							<template slot-scope="scope">
								<span class="strongMark">
									{{ data.currencySymbol }}
									{{ scope.row.price }}
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="skuName"
							label="操作"
							width="100"
							align="center"
						>
							<template slot-scope="scope">
								<el-button
									type="text"
									@click="removeProduct(scope)"
									>删除</el-button
								>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div v-if="unvalidList.length > 0">
					<p>失效商品</p>
					<el-table
						:data="unvalidList"
						class="productTable unvalidTable"
					>
						<el-table-column
							width="40"
							class-name="checkboxTd"
							align="center"
						>
							<template>
								<span class="unvalide">失效</span>
							</template>
						</el-table-column>
						<el-table-column label="商品信息">
							<template slot-scope="scope">
								<div class="product">
									<div class="productImg">
										<custom-img
											:src="scope.row.skuImg"
										></custom-img>
									</div>
									<div class="productInfo">
										<p class="title">
											{{ scope.row.skuName }}
										</p>
										<p class="text-grey spec">
											<span
												class="specItem"
												v-for="(item, index) in scope
													.row.skuSpec"
												:key="index"
											>
												{{ item.specName }} :
												{{ item.specValue }}；
											</span>
										</p>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="skuName"
							label="单价"
							width="150"
							align="center"
						>
							<template slot-scope="scope">
								<span class="strongMark">
									{{ data.currencySymbol }}
									{{ scope.row.price }}
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="skuName"
							label="数量"
							width="150"
							align="center"
						>
							<template slot-scope="scope">
								<el-input-number
									v-model="scope.row.quantity"
									:step="1"
									step-strictly
									size="small"
									disabled
								></el-input-number>
							</template>
						</el-table-column>
						<el-table-column
							prop="skuName"
							label="小计"
							width="150"
							align="center"
						>
							<template slot-scope="scope">
								<span class="strongMark">
									{{ data.currencySymbol }}
									{{ scope.row.price }}
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="skuName"
							label="操作"
							width="100"
							align="center"
						>
							<template slot-scope="scope">
								<el-button
									type="text"
									@click="removeProduct(scope)"
									>删除</el-button
								>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<div class="operate clearfix">
				<div class="plop">
					<el-checkbox
						:disabled="cartList.length == 0"
						v-model="checkAll"
						class="selectAll"
						@change="selectAllFun"
						:indeterminate="isIndeterminate"
						>全选</el-checkbox
					>
					<el-button type="text" :disabled="plDisabled"
						>批量删除</el-button
					>
					<el-button type="text">清除失效商品</el-button>
				</div>
				<div class="tjop">
					<span class="totalCount"
						>已选商品
						<span class="strongMark">{{
							selectProduct.length
						}}</span>
						件</span
					>
					<span class="totalPrice"
						>合计（不含运费）：<span class="strongMark"
							>{{ data.currencySymbol
							}}{{ data.totalPrice }}</span
						></span
					>
					<el-button
						class="submitBtn"
						type="primary"
						:disabled="plDisabled"
						>去结算</el-button
					>
				</div>
			</div>
		</div>
		<div class="noData" v-else>
			<div class="empty">
				<div class="icon">
					<svg-icon name="icon-qicheqianlian-"></svg-icon>
				</div>
				<p>购物车内暂时没有商品，登录后将显示您之间加入的商品</p>
				<el-button type="primary" size="small">登录</el-button>
				<el-button type="primary" size="small" plain>去逛逛</el-button>
			</div>
		</div>
	</div>
</template> 
<script>
import pageTitle from "../components/pageTitle";
import {cartData} from "@/api/cart"
import {getList} from "@/api/table"
export default {
	data() {
		return {
			title: "购物车",
			checkAll: false,
			isIndeterminate: false,
			selectProduct: [],
			cartList: [],
			unvalidList: [],
			data: {
				totalPrice: 5,
				totalNum: 8,
				currencySymbol: "￥",
				shoppingCartList: [
					{
						productId: 143,
						skuId: 260,
						quantity: 11, //购买数量
						skuName:
							"货品名称货品名称货品名称货品名称货品名称货品名称货品名称货品名称货品名称货品名称货品名称货品名称", //货品名称
						skuImg:
							"https://pre-omo-oss-image.site.cn/shop/PDEMO_OqZHU87nTlMB/cms/image/624d3f0d-bcfc-4d90-b5eb-36350aae.jpg", //货品图片
						skuSpec: [
							{
								specName: "规格名称",
								specValue: "规格值",
							},
						],
						price: 110.0, //货品单价
						moq: 10, //起订量
						stock: 10000, //库存
						productUrl: "/product/144. html", //链接
						statusTip: 3, //货品状态 0:下架 1: 库存不足 2:价格变动 3:正常有货
					},
					{
						productId: 143,
						skuId: 260,
						quantity: 11, //购买数量
						skuName: "库存不足库存不足库存不足库存不足", //货品名称
						skuImg:
							"https://pre-omo-oss-image.site.cn/shop/PDEMO_OqZHU87nTlMB/cms/image/624d3f0d-bcfc-4d90-b5eb-363c59550aae.jpg", //货品图片
						skuSpec: [
							{
								specName: "规格名称",
								specValue: "规格值",
							},
						],
						price: 110.0, //货品单价
						moq: 10, //起订量
						stock: 10000, //库存
						productUrl: "/product/144. html", //链接
						statusTip: 1, //货品状态 0:下架 1: 库存不足 2:价格变动 3:正常有货
					},
					{
						productId: 143,
						skuId: 260,
						quantity: 11, //购买数量
						skuName: "货品已下架货品已下架货品已下架", //货品名称
						skuImg:
							"https://pre-omo-oss-image.site.cn/shop/PDEMO_OqZHU87nTlMB/cms/image/624d3f0d-bcfc-4d90-b5eb-363c59550aae.jpg", //货品图片
						skuSpec: [
							{
								specName: "规格名称",
								specValue: "规格值",
							},
						],
						price: 110.0, //货品单价
						moq: 10, //起订量
						stock: 10000, //库存
						productUrl: "/product/144. html", //链接
						statusTip: 0, //货品状态 0:下架 1: 库存不足 2:价格变动 3:正常有货
					},
					{
						productId: 143,
						skuId: 260,
						quantity: 11, //购买数量
						skuName:
							"货品名称货品名称货品名称货品名称货品名称货品名称货品名称货品名称货品名称货品名称货品名称货品名称", //货品名称
						skuImg:
							"https://pre-omo-oss-image.site.cn/shop/PDEMO_OqZHU87nTlMB/cms/image/624d3f0d-bcfc-4d90-b5eb-363c59550aae.jpg", //货品图片
						skuSpec: [
							{
								specName: "规格名称",
								specValue: "规格值",
							},
						],
						price: 110.0, //货品单价
						moq: 10, //起订量
						stock: 10000, //库存
						productUrl: "/product/144. html", //链接
						statusTip: 3, //货品状态 0:下架 1: 库存不足 2:价格变动 3:正常有货
					},
				],
			},
		};
	},
	computed: {
		plDisabled() {
			return this.selectProduct.length == 0;
		},
	},
	mounted() {
		this.renderData();
	},
	methods: {
		//初始化数据
		 renderData() {
			 
			 cartData({tenantId:1600018169}).then(res =>{
				 console.log(res)
			 })
			//let res = await cartLists({tenantId:1600018169})
			this.data.shoppingCartList.forEach((e) => {
				if (e.statusTip == 3) {
					this.cartList.push(e);
				} else {
					this.unvalidList.push(e);
				}
			});
		},
		//删除
		removeProduct(obj) {},
		//表格选择
		selectProductFun(val) {
			this.selectProduct = val;
			this.isIndeterminate =
				val.length > 0 && val.length < this.cartList.length;
			this.checkAll = val.length === this.cartList.length;
		},
		//全选
		selectAllFun(val) {
			if (val) {
				this.cartList.forEach((e) => {
					this.$refs.cartList.toggleRowSelection(e, "selected");
				});
			} else {
				this.$refs.cartList.clearSelection();
			}
			this.isIndeterminate = false;
		},
	},
	components: {
		pageTitle,
	},
};
</script>
<style>
.checkboxTd .cell {
	padding: 0 10px;
}
.unvalidTable .checkboxTd .cell {
	padding: 0;
}
.productTable {
	color: #000;
}
.productTable .el-table__header-wrapper th {
	background: #f0f0f0;
}
</style>
<style scoped>
.strongMark {
	color: #f56c6c;
	font-weight: bold;
}
.cartList {
	padding: 20px 0;
}
.productTable {
	margin-bottom: 50px;
	border: 1px solid #eee;
}
.product {
	position: relative;
	height: 80px;
}
.productImg {
	width: 80px;
	height: 80px;
	position: absolute;
	left: 0;
	top: 0;
}
.productImg img {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.productInfo {
	padding-left: 100px;
}
.title {
	margin: 0;
	padding: 0;
	line-height: 26px;
	overflow: hidden;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}
.spec {
	margin: 0;
	padding: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	line-height: 20px;
	padding-top: 8px;
}
.unvalide {
	background: #c5c5c5;
	color: #fff;
	border-radius: 8px;
	padding: 2px 5px;
	font-size: 12px;
}
.selectAll {
	margin-right: 30px;
	margin-left: 10px;
}
.operate {
	border: 1px solid #eee;
}
.plop {
	float: left;
}
.tjop {
	float: right;
}
.submitBtn {
	margin-left: 30px;
	border-radius: 0;
}
.totalPrice {
	padding-left: 30px;
}
.noData {
	min-height: 300px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.empty {
	padding-left: 110px;
	position: relative;
}
.icon {
	width: 100px;
	font-size: 76px;
	color: #409eff;
	position: absolute;
	left: 0;
	top: 0;
}
</style>

