<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import {getHeaderFoot,getList}  from '@/api/menu'
export default {
  name: 'App',
  data(){
	  return{
		  dataList:[],
		  dataSource:[]
	  }
  },
  created(){
    this.getMenu()
	   window['headFooterEdit'] = (hf,tempId) => {
		if(hf&&hf.indexOf("head") != -1){
			this.headerEdit(tempId)
		}else{
			this.headerEdit()
		}
		if(hf&&hf.indexOf("footer") != -1){
			this.footerEdit(tempId)
		}else{
			this.footerEdit()
		}
        
        
     }
  },
  methods:{
    async  getMenu(){
        let res = await getList()
		
			if(res.code == 200 && res.data.length>0){
                this.dataList.length = 0
				this.dataSource = res.data;
				 res.data.forEach((item) =>{
					 
                     if(item.isMenu==1){
                         let path = item.linkAddress.replace(/\/?sys/g,'')
                        this.dataList.push({title:item.name,path:path,motherHeadId:item.motherHeadId,motherFootId:item.motherFootId})    
                     }
					 
				 })
				this.dataList.push({title:'自行增加数据',path:'/jsonHtml',motherHeadId:null,motherFootId:null})
        		localStorage.setItem('dataList',JSON.stringify(this.dataList))
        		localStorage.setItem('dataSource',JSON.stringify(this.dataSource))
				this.headerEdit()
				 this.footerEdit()
            
			}
        },
	async headerEdit(tempId){
		let tpl = this.setHeadFoot('header',tempId)
		
		if(tpl){
			let res = await getHeaderFoot({'tpl':tpl})
			if(res){
				var headers = document.getElementById('headers')
					headers.innerHTML = res;
					headers.setAttribute('data-tmplid',tpl)
					
			}
		}
	},
	setHeadFoot(str,tempId){
		let sURL = this.$route.path;
		let tpl = '';
		let dHeadr =tempId;
		let dFooter = tempId;
		if(!tempId){
			this.dataSource.forEach((item) => {
			
				item.linkAddress = item.linkAddress.replace(/\/?sys/g,'')
				if(sURL == item.linkAddress || (sURL == '/'&&item.linkAddress =='/information')){
					dHeadr = item.motherHeadId;
					dFooter = item.motherFootId;
					console.log(item.name)
					window.currentPage = item
				}
			})
			//跳转第三方链接没有header默认插入返回菜单列表第一条数据
			if(!dHeadr&&this.dataSource.length>0){
				dHeadr = this.dataSource[0].motherHeadId
			}
			if(!dFooter&&this.dataSource.length>0){
				dFooter = this.dataSource[0].motherFootId;
			}
			
		}

		if(str.indexOf('header')!=-1){
			tpl = dHeadr
		}
		if(str.indexOf('footer')!=-1){
			tpl = dFooter
		}
		return tpl
	},    
	async footerEdit(tempId){
		let tpl = this.setHeadFoot('footer',tempId)
		if(tpl){
			
			let resFoot = await getHeaderFoot({'tpl':tpl})	
		if(resFoot){
			var footers = document.getElementById('footers')
			footers.innerHTML = resFoot;
			footers.setAttribute('data-tmplid',tpl)
		}
		
		
		}	
	},
  }
}
</script>

