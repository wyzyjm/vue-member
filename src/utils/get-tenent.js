import Vue from 'vue'
fetch(window.location.origin+'/tenant.json')
  .then(function(response) {
    return response.body;
  })
  .then(function(result) {
    Vue.prototype.$tenantInfo = result;
  });
