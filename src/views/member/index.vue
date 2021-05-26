<template>
	<div class="page-container">
		<div class="leftMenu" v-if="!noSidebar">
			<sidebar :sidebar="dataList"></sidebar>
		</div>
		<div class="righCon" :class="{ noSidebar: noSidebar }">
			<router-view />
		</div>
	</div>
</template>
<script>
import sidebar from "./sidebar";
export default {
	data() {
		return {
			dataList: [
				{
					title: "我的资料",
					path: "/information",
				},
				{
					title: "我的订单",
					path: "/order/list",
				},
				{
					title: "我的表单",
					path: "/form",
				},
				{
					title: "我的收藏",
					path: "/collection",
				},
				{
					title: "收货地址",
					path: "/address",
				},
				{
					title: "购物车",
					path: "/memberCart",
				},
			],
		};
	},
	computed: {
		noSidebar() {
			let flag = false;
			if (this.$route.path == "/order/detail") {
				flag = true;
			}
			return flag;
		},
	},
	methods: {},
	components: {
		sidebar,
	},
};
</script>
<style scoped>
.leftMenu {
	width: 200px;
	float: left;
	margin-right: 20px;
	border: 1px solid #eee;
	box-sizing: border-box;
}
.righCon {
	width: calc(100% - 220px);
	float: left;
	border: 1px solid #eee;
	padding: 0 20px 20px 20px;
}
.noSidebar {
	width: 100%;
	border: none;
}
</style>

