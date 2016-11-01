"use strict";

$(document).ready(function(){
  FbAPI.firebaseCredentials().then(function(keys){
    console.log("keys", keys);
  });



});




