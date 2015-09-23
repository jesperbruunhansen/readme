angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope) {

    $scope.title = "Hello world";
    $scope.testFunction = function () {
      alert("hej");
    }



  })
  .controller('LoginCtrl', function($scope, $location){

    $scope.login = function(username, password){

        Parse.User.logIn(username, password, {
          success:function(user){
            console.log(user.get("programme").id);



          },
          error:function(err){
            console.log(err);
          }
        });



    }

  })
  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
