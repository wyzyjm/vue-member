<template>
	<div class="sidebar">
		<div class="title">个人中心</div>
		<ul class="menu" v-if="dataList.length>0">
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
			dataList: [],
			flag:0
		};
	},
	props: ["sidebar"],
	mounted() {
		this.dataList = this.sidebar;
	},
	computed: {
		currentPage() {
			return function (path) {
				let cpath = this.$route.path;
				return path == cpath;
			};
		},
	},
	methods: {
		routerPush(path) {
			let data = this.$router.options.routes;
			 this.dataItem(data,path)
			if(this.flag ){
				this.flag = 0;
					this.$router.push({ path: path });
				
				}else{
					window.open(path,'_blank')
				} 
			

				
		},
		//请求的后台菜单是否属于路由地址，不属于新窗口跳转
		dataItem(arr,path){ 
			arr.forEach((item) => { 
                 if(item.path.includes('order') !=-1 || item.path==path)
                 {  
					 this.flag = 1
                 }
                 else if(item.children)
                 {
                     this.dataItem(item.children, path);                        
                 }                   
            })

			
		}
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

