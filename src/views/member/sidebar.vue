<template>
	<div class="sidebar">
		<div class="title">个人中心</div>
		<ul class="menu">
			<li
				v-for="(item, index) in dataList"
				:key="index"
				class="item"
				:class="{ active: currentPage(item.path) }"
			>
				<a @click="routerPush(item.path)">{{ item.title }}</a>
			</li>
		</ul>
	</div>
</template>
<script>
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
					path: "/order",
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
		currentPage() {
			return function (path) {
				return path == this.$route.path;
			};
		},
	},
	methods: {
		routerPush(path) {
			this.$router.push({ path: path });
		},
	},
};
</script>
<style scoped>
.sidebar {
	text-align: center;
	padding: 20px 0;
}
.title {
	line-height: 40px;
	font-size: 18px;
	border-bottom: 1px solid #ddd;
}
.menu {
	margin: 0;
	padding: 0;
	list-style: none;
}
.item {
	line-height: 44px;
	box-sizing: border-box;
	border-left: 5px solid #fff;
}
.item a {
	display: block;
}
.item:hover,
.item.active {
	background: #e8f4ff;
	color: #1f98fc;
	border-left: 5px solid #1f98fc;
}
</style>

