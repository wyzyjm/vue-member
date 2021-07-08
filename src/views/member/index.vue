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
			dataList:[]
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
		    let res = await this.$store.dispatch(`user/getList`)
		
			if(res.code == 200 && res.data.length>0){
				 res.data.forEach((item) =>{
					 let path = item.linkAddress.replace(/\/?sys/g,'')
					 this.dataList.push({title:item.name,path:path,motherHeadId:item.motherHeadId,motherFootId:item.motherFootId})
				 })
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

