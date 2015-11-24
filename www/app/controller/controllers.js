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

  .controller('ForecastCtrl', function ($scope, Data, $ionicModal, $ionicLoading) {

    $scope.isForecasting = false;
    $scope.isLoading = false;

    /**
     * IONIC MODAL
     */
    $ionicModal.fromTemplateUrl('/templates/my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.schedule = function (Course, Lecture, Syllabus) {
      $scope.modal.Syllabus = angular.extend({}, Syllabus);
      $scope.modal.Lecture = angular.extend({}, Lecture);
      $scope.modal.Course = angular.extend({}, Course);
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    /**
     * FORECASTING
     */
    $scope.forecast = function () {

      $scope.isForecasting = true;

      //Loading
      $ionicLoading.show({
        template: '<ion-spinner icon="ios" class="spinner-light"></ion-spinner><p>Checking your upcoming lectures<br>Hang in tight!</p>'
      });

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
          $ionicLoading.hide();
          $scope.forecast = forecast;
        });

        console.log(forecast);

      }, function (err) {
        console.log(err);
      });
    };


  })

  .controller('CalendarCtrl', function ($scope) {

  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
