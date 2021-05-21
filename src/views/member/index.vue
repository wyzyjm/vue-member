<template>
	<div class="page-container">
		<div class="leftMenu">带左侧菜单</div>
		<div class="righCon">
			<router-view />
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {};
	},
	methods: {},
};
</script>
<style scoped>
.leftMenu {
	width: 200px;
	float: left;
	margin-right: 20px;
	border: 1px solid #ddd;
	box-sizing: border-box;
}
.righCon {
	width: calc(100% - 220px);
	float: left;
	border: 1px solid #ddd;
}
</style>

