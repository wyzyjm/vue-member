import {getAppByName} from '@/api/menu'
getAppByName().then((res)=>{
  if(res.status==200){
    window.appMap = res.data;
  }else{
    console.log('获取appid失败')
  }
})