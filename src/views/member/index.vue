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
import {getList} from '@/api/menu'
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
				{
					title: "自行增加数据",
					path: "/jsonHtml",
				},
				{
					title: "百度",
					path: "http://baidu.com",
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
		this.menuList()
	},
	methods: {
		async menuList(){
		    let res = await getList()
		
			if(res.code == 200 && res.data.length>0){
				this.dataList.length = 0;
				 res.data.forEach((item) =>{
					 
					 if(item.isMenu){
						 let path = item.linkAddress.replace(/\/?sys/g,'')
						 this.dataList.push({title:item.name,path:path,motherHeadId:item.motherHeadId,motherFootId:item.motherFootId})
					 }
					 
				 })

				 this.dataList.push({title:'自行增加数据',path:'/jsonHtml',motherHeadId:null,motherFootId:null})
			}
		}
		
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

