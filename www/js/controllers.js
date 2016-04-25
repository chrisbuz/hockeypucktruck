var app = angular.module('starter.controllers', [])

app.controller("usersController", ['$scope', '$http', '$cordovaToast', function ($scope, $http, $cordovaToast){
    var vm = this;

    vm.firstname = "";
    vm.lastname = "";
    vm.email = "";

    vm.users = {};
    vm.usersLoaded = false;

    function update(){
        //setTimeout(function(){
        $http.get('/allusers').then(function(res){
            for(var i=0; i < res.data.length; i++){
                    vm.users[res.data[i].id] = res.data[i];
                }
                     
                    vm.UsersLoaded = true;
                },
                function(err){
                    console.log("Error: " + err + " occurred.") 
                }
            );
        //}, 500); 
    }

    update();

    vm.submit = function(){
        if(vm.firstname === "" || vm.lastname === "" || vm.email === "" ) {
            alert('Please fill out all fields!');
        }
        else{

            $http.post('/adduser', {name: vm.firstname + " " + vm.lastname , email: vm.email})
                .then(function(res){
                    update();
                });
        }
    }  

    vm.delete = function(key){
        $http.delete('/deleteuser/' + key)
            .then(function(res){
                delete vm.users[key];               
                update();
        });
    }

    vm.update = function(key, _name, _email){
        $http.put('/updateuser/' + key, {name:_name, email:_email})
            .then(function(res){               
                update();
        });
    }

}]);