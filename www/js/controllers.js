var app = angular.module('starter.controllers', [])

app.controller("usersController", ['$scope', '$http', 'toaster',function ($scope, $http, toaster){
    var vm = this;

    vm.firstname = "";
    vm.lastname = "";
    vm.email = "";

    vm.users = {};
    vm.usersLoaded = false;

     /*vm.pop = function(){
        toaster.success({title: "title", body:"text1"});
        toaster.error("title", "text2");
        toaster.pop({type: 'wait', title: "title", body:"text"});
        toaster.pop('success', "title", '<ul><li>Render html</li></ul>', 5000, 'trustedHtml');
        toaster.pop('error', "title", '<ul><li>Render html</li></ul>', null, 'trustedHtml');
        toaster.pop('wait', "title", null, null, 'template');
        toaster.pop('warning', "title", "myTemplate.html", null, 'template');
        toaster.pop('note', "title", "text");
        toaster.pop('success', "title", 'Its address is https://google.com.', 5000, 'trustedHtml', function(toaster) {
            var match = toaster.body.match(/http[s]?:\/\/[^\s]+/);
            if (match) $window.open(match[0]);
            return true;
        });
        toaster.pop('warning', "Hi ", "{template: 'myTemplateWithData.html', data: 'MyData'}", 15000, 'templateWithData');
    };*/

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
            //alert('Please fill out all fields!');
            toaster.pop('warning', "Incomplete Submission", "Please fill out all fields!");
        }
        else{

            $http.post('/adduser', {name: vm.firstname + " " + vm.lastname , email: vm.email})
                .then(function(res){
                    toaster.pop('success', "User Submission", "The user has been uploaded!");
                    update();
                });
        }
    }  

    vm.delete = function(key){
        $http.delete('/deleteuser/' + key)
            .then(function(res){
                delete vm.users[key];  
                toaster.pop('note', "User Deletion", "The user has been deleted!");             
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