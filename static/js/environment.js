if (window["context"] == undefined) {
    if (!window.location.origin) {
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    }
    window["context"] = location.origin+"/V6.0";
}
function getenvironment(){
  var hostname = window.location.hostname,env;
  if(hostname == 'localhost'){
    env = 'local'
  }else{
    if(hostname.indexOf('dev') == -1 && hostname.indexOf('test') == -1 && hostname.indexOf('pre') == -1){
      env = 'console'
    }else if(hostname.indexOf('pre') > -1){
      env = 'pre'
    }else if(hostname.indexOf('test') > -1){
      env = 'test'
    }else{
      env = 'dev'
    }
  }
  var envData = {
    local:{
      baseURL:'https://test-web-site.yun300.cn',
    },
    test:{
      baseURL:location.origin,
    },
    pre:{
      baseURL:location.origin,
    },
    console:{
      baseURL:location.origin,
    },
  }
  return envData[env]
}
__ce = Object.assign({
  _: {},
  debug:true,
},getenvironment())
