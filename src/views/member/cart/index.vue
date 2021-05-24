<template>
	<div class="app-container">
		<page-title :pagetitle="title">
			<slot slot="slot">插槽，订单列表可以插入搜索</slot>
		</page-title>
	</div>
</template>
<script>
import pageTitle from "../pageTitle";
export default {
	data() {
		return {
			title: "购物车",
		};
	},
	methods: {},
	components: {
		pageTitle,
	},
};
</script>
<style scoped>
</style>

