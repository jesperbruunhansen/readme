angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, Model) {

    Model.getCourses().then(function(courses){

      return courses.findUpcomingLectures();

    }, function(error){
      console.log(error);
    }).then(function(lectures){

      return lectures.getLectureContent();

    }, function(err){
      console.log(err);
    }).then(function(readings){

      return readings.hasArticlesBeenRead()

    }, function (err) {
      console.log(err);
    }).then(function (foo) {
      console.log(foo);
    }, function (err) {
      console.log(err);
    });

  })

  .controller('ChatsCtrl', function ($scope, Chats) {


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
