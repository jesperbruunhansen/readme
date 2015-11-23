angular.module('starter.controllers', ["starter.data"])

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

  .controller('ForecastCtrl', function ($scope, Data, $ionicModal) {

    $scope.isForecasting = false;
    $scope.isLoading = false;

    $ionicModal.fromTemplateUrl('/templates/my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.schedule = function(Syllabus) {

      console.log(Syllabus);

      $scope.modal.show();
      $scope.modal.syllabus = Syllabus;
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.forecast = function () {

      $scope.isForecasting = true;
      $scope.isLoading = true;

      Data.Forecast.loadAllCourses().then(function (forecast) {

        return Data.Course.loadLectures(forecast);

      }, function (err) {
        console.log(err);
      }).then(function (forecast) {

        return Data.Lecture.loadSyllabuses(forecast);

      }, function (err) {
        console.log(err);
      }).then(function (forecast) {

        return Data.Syllabus.loadStatus(forecast);

      }, function (err) {
        console.log(err);
      }).then(function (forecast) {

        return Data.Syllabus.hasAllBeenPlanned(forecast);

      }, function (err) {
        console.log(err);
      }).then(function (forecast) {

        $scope.$apply(function () {
          $scope.isLoading = false;
          $scope.forecast = forecast;
        });

        console.log(forecast);

      }, function (err) {
        console.log(err);
      });
    };



    /*Data.Course.getAll().then(function (courses) {

      console.log(courses);

      return Data.Lecture.getAllFrom(courses);

    }, function (err) {
      console.log(err);
    }).then(function (lectures) {

      return Data.Lecture.getAllSyllabuses(lectures)

    }).then(function (lectures) {

      return Data.Lecture.hasAllSyllabusesBeenRead(lectures)
        .then(function () {
          return Data.Syllabus.prioritize(lectures);
        });

    }, function (err) {
      console.log(err);
    }).then(function (prioritizedSyllabus) {

      return Data.Syllabus.hasAllBeenPlanned(prioritizedSyllabus);

    }, function (err) {
      console.log(err);
    }).then(function (syllabusList) {

      console.log(syllabusList);
      $scope.$apply(function () {
        $scope.syllabusList = syllabusList;
      });


    }, function (err) {
      console.log(err);
    });*/

    /*$scope.isForecasting = false;
    $scope.forecast = function () {

      $scope.isForecasting = true;
      console.log("Hllo");



    };
*/

  })

  .controller('CalendarCtrl', function ($scope) {

  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
