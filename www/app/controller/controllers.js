angular.module('starter.controllers', [])

  .controller('LoginCtrl', function ($scope, $state) {

    $scope.data = {};

    $scope.loginEmail = function () {
      Parse.User.logIn($scope.data.username, $scope.data.password, {
        success: function (user) {
          // Do stuff after successful login.
          $state.go('tab.study');
          console.log(user);
          //alert("success!");
        },
        error: function (user, error) {
          // The login failed. Check error to see why.
          console.log(error);
          alert("error!");
        }
      });
    };
  })

  .controller('StudyCtrl', function ($scope, Courses) {

    $scope.courses = Courses.all();
    $scope.remove = function (course) {
      Courses.remove(course);
    };
  })

  .controller('StudyDetailCtrl', function ($scope, $stateParams, Courses) {

    $scope.course = Courses.get($stateParams.courseId);
    $scope.courses = Courses.all();

  })

  .controller('StatsCtrl', function ($scope) {

  })

  .controller('ForecastCtrl', function ($scope, Model) {

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

  .controller('CalendarCtrl', function ($scope) {

  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
