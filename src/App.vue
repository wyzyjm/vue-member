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
	   window['headerEdit'] = () => {
        this.headerEdit()
        this.footerEdit()
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

        		localStorage.setItem('dataList',JSON.stringify(this.dataList))
				this.headerEdit()
				 this.footerEdit()
            
			}
        },
	async headerEdit(){
    console.log(this.$route.path)
		let sURL = this.$route.path;
		let dHeadr ='';
		this.dataList.forEach((item) => {
			if(sURL == item.path || (sURL == '/'&&item.path =='/information')){
				dHeadr = item.motherHeadId
				
			}
		})
		if(dHeadr){
			let res = await getHeaderFoot({'tpl':dHeadr})
			if(res){
				var headers = document.getElementById('headers')
					headers.innerHTML = res;
					headers.setAttribute('data-tmplid',dHeadr)
					
			}
		}
	},
		       
	async footerEdit(){
		let sURL = this.$route.path;
		let dFooter = '';
		this.dataList.forEach((item) => {
			if(sURL == item.path || (sURL == '/'&&item.path =='/information')){
				dFooter = item.motherFootId
			}
		})

		if(dFooter){
			
			let resFoot = await getHeaderFoot({'tpl':dFooter})	
		if(resFoot){
			var footers = document.getElementById('footers')
			footers.innerHTML = res;
			footers.setAttribute('data-tmplid',dFooter)
		}
		
		
		}	
	},
  }
}
</script>
