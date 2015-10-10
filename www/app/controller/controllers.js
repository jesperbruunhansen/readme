angular.module('starter.controllers', [])

  .controller('LoginCtrl', function ($scope, $state) {

    $scope.data = {};

    $scope.loginEmail = function () {
      Parse.User.logIn($scope.data.username, $scope.data.password, {
        success: function (user) {
          // Do stuff after successful login.
          $state.go('tab.dash');
          console.log(user);
          //alert("success!");
        },
        error: function (user, error) {
          // The login failed. Check error to see why.
          alert("error!");
        }
      });
    };
  })

  .controller('DashCtrl', function ($scope, Model) {

    Model.getCourses().then(function (courses) {

      return courses.findUpcomingLectures();

    }, function (error) {
      console.log(error);
    }).then(function (lectures) {

      return lectures.getLectureContent();

    }, function (err) {
      console.log(err);
    }).then(function (readings) {

      var articles = readings.hasArticlesBeenRead();
      var chapters = readings.hasChaptersBeenRead();

      Parse.Promise.when(articles, chapters)
        .then(function (articles, chapters) {

          Model.hasReadingBeenPlanned(articles, chapters);

        });


    }, function (err) {
      console.log(err);
    }).then(function (foo) {


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
