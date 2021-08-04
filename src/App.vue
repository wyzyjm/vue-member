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
		  dataList:[]
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
				 res.data.forEach((item) =>{
					 
                     if(item.isMenu==1){
                         let path = item.linkAddress.replace(/\/?sys/g,'')
                       this.dataList.push({title:item.name,path:path,motherHeadId:item.motherHeadId,motherFootId:item.motherFootId})  
                     }
					 
				 })
				this.dataList.push({title:'自行增加数据',path:'/jsonHtml',motherHeadId:null,motherFootId:null})
					
        		localStorage.setItem('dataList',JSON.stringify(this.dataList))
				this.headerEdit()
				 this.footerEdit()
            
			}
        },
	async headerEdit(tempId){
		let sURL = this.$route.path;
		let dHeadr =tempId;
		if(!tempId){
			this.dataList.forEach((item) => {
				if(sURL == item.path || (sURL == '/'&&item.path =='/information')){
					dHeadr = item.motherHeadId
					
				}
			})
		}
		
		if(dHeadr){
			let res = await getHeaderFoot({'tpl':dHeadr})
			if(res){
				var headers = document.getElementById('headers')
					headers.innerHTML = res;
					headers.setAttribute('data-tmplid',dHeadr)
					
			}
		}
	},
		       
	async footerEdit(tempId){
		let sURL = this.$route.path;
		let dFooter = tempId;
		if(!tempId){
			this.dataList.forEach((item) => {
				if(sURL == item.path || (sURL == '/'&&item.path =='/information')){
					dFooter = item.motherFootId
				}
			})
		}
		

		if(dFooter){
			
			let resFoot = await getHeaderFoot({'tpl':dFooter})	
		if(resFoot){
			var footers = document.getElementById('footers')
			footers.innerHTML = resFoot;
			footers.setAttribute('data-tmplid',dFooter)
		}
		
		
		}	
	},
  }
}
</script>

