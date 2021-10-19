<template>
	<div class="page-container">
		<div class="leftMenu" v-if="!noSidebar">
			<sidebar  :sidebar="dataList"></sidebar>
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
					title: this.$t('member_index_1'),
					path: "/information",
				},
				{
					title: this.$t('member_index_2'),
					path: "/order/list",
				},
				{
					title: this.$t('member_index_3'),
					path: "/form",
				},
				{
					title: this.$t('member_index_4'),
					path: "/collection",
				},
				{
					title: this.$t('member_index_5'),
					path: "/address",
				},
				{
					title: this.$t('member_index_6'),
					path: "/memberCart",
				},
				{
					title: this.$t('member_index_7'),
					path: "/jsonHtml",
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
	created(){
		//动态表单注释
		this.menuList()
		
		
	},
	methods: {
		async menuList(){
			 this.dataList = JSON.parse(localStorage.getItem('dataList'));
		},
		
		
	},
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

