<template>
	<div class="page-container">
		<div class="leftMenu">
			<sidebar></sidebar>
		</div>
		<div class="righCon">
			<page-title></page-title>
			<router-view />
		</div>
	</div>
</template>
<script>
import sidebar from "./sidebar";
import pageTitle from "./pageTitle";
export default {
	data() {
		return {};
	},
	methods: {},
	components: {
		sidebar,
		pageTitle,
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
	padding: 0 10px 20px 10px;
}
</style>

