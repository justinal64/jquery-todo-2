"use strict";

let apiKeys = {};
let uid = "";

function putTodoInDOM (){
    FbAPI.getTodos(apiKeys, uid).then(function(items){
        console.log("items from FB", items);
        $('#completed-tasks').html("");
        $('#incomplete-tasks').html("");
        items.forEach(function(item){
            if(item.isCompleted === true){
                let newListItem = `<li data-completed="${item.isCompleted}">`;
                newListItem+=`<div class="col-xs-8" data-fbid="${item.id}">`;
                newListItem+='<input class="checkboxStyle" type="checkbox" checked>';
                newListItem+=`<label class="inputLabel">${item.task}</label>`;
                newListItem+='</div>';
                newListItem+='</li>';
                //apend to list
                $('#completed-tasks').append(newListItem);
            } else {
                let newListItem = `<li data-completed="${item.isCompleted}">`;
                newListItem+=`<div class="col-xs-8" data-fbid="${item.id}">`;
                newListItem+='<input class="checkboxStyle" type="checkbox">';
                newListItem+=`<label class="inputLabel">${item.task}</label>`;
                newListItem+='<input type="text" class="inputTask">';
                newListItem+='</div>';
                newListItem+='<div class="col-xs-4">';
                newListItem+=`<button class="btn btn-default col-xs-6 edit" data-fbid="${item.id}">Edit</button>`;
                newListItem+=`<button class="btn btn-danger col-xs-6 delete"  data-fbid="${item.id}">Delete</button> `;
                newListItem+='</div>';
                newListItem+='</li>';
                //apend to list
                $('#incomplete-tasks').append(newListItem);
            }

      });
    });
}

$(document).ready(function(){
    FbAPI.firebaseCredentials().then(function(keys){
        // console.log("keys", keys);
        apiKeys = keys;
        firebase.initializeApp(apiKeys);
    });

    $('#add-todo-button').on('click', function(){
        console.log("clicked new todo button");
        let newItem = {
            "task": $('#add-todo-text').val(),
            "isCompleted" : false
        };
        FbAPI.addTodo(apiKeys, newItem).then(function(){
            putTodoInDOM();
        });
    });


    $('ul').on("click", ".delete", function(){
        let itemId = $(this).data("fbid");
        FbAPI.deleteTodo(apiKeys, itemId).then(function(){
            putTodoInDOM();
        });
    });

    $('ul').on("click", ".edit", function() {
        let parent = $(this).closest('li');
        if(!parent.hasClass("editMode")) {
            parent.addClass("editMode");

        } else {
            let itemId = $(this).data("fbid");
            let editedItem = {
                "task": parent.find(".inputTask").val(),
                "isCompleted": false
            };
            // firebase stuff...
            FbAPI.editTodo(apiKeys, itemId, editedItem).then(function() {
                parent.removeClass("editMode");
                putTodoInDOM();
            });
        }
    });

    $('ul').on('change', 'input[type="checkbox"]', function() {
        let updateIsCompleted = $(this).closest('li').data('completed');
        console.log("updateIsCompleted", updateIsCompleted );
        let itemId = $(this).parent().data('fbid');
        let task = $(this).siblings(".inputLabel").html();

        let editedItem = {
            "task": task,
            "isCompleted": !updateIsCompleted
        };
        FbAPI.editTodo(apiKeys, itemId, editedItem).then(function() {
            putTodoInDOM();
        });
    });

    $('#registerButton').on("click", function() {
        let user = {
            "email": $('#inputEmail').val(),
            "password": $('#inputPassword').val()
        };

        FbAPI.registerUser(user).then(function(response) {
            console.log("register response", response);
            return FbAPI.loginUser(user);
        }).then(function(loginResponse) {
            console.log("loginResponse", loginResponse);
            uid = loginResponse.uid;
            putTodoInDOM();
            $('#login-container').addClass("hide");
            $('#todo-container').removeClass("hide");
        });
    });

    $('#loginButton').on('click', function() {
        let user = {
            "email": $('#inputEmail').val(),
            "password": $('#inputPassword').val()
        };
        FbAPI.loginUser(user).then(function(loginResponse) {
            uid = loginResponse.uid;
            putTodoInDOM();
            $('#login-container').addClass("hide");
            $('#todo-container').removeClass("hide");
        });
    });

});




