"use strict";

  let apiKeys = {};

$(document).ready(function(){
  FbAPI.firebaseCredentials().then(function(keys){
    console.log("keys", keys);
    apiKeys = keys;
    firebase.initializeApp(apiKeys);
    FbAPI.getTodos(apiKeys).then(function(items){
      console.log("items from FB", items);
    });
  });



});




