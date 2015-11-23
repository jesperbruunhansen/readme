// Ionic Starter App

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', "starter.model"])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }
    });

    Parse.initialize("qFjmgqSPB4G94fwh8NmRNpfNXuFr0VqTbkSIgcea", "WdD4dthiY4BW7Qcdq0Ydwlx7EMmJ7TN6BzuHq3ND");

  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Set tabs at the bottom for all OS
    $ionicConfigProvider.tabs.position('bottom');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:
      .state('tab.study', {
        url: '/study',
        views: {
          'tab-study': {
            templateUrl: 'templates/tab-study.html',
            controller: 'StudyCtrl'
          }
        }
      })
      .state('tab.study-detail', {
        url: '/study/:courseId',
        views: {
          'tab-study': {
            templateUrl: 'templates/study-detail.html',
            controller: 'StudyDetailCtrl'
          }
        }
      })

      .state('tab.stats', {
        url: '/stats',
        views: {
          'tab-stats': {
            templateUrl: 'templates/tab-stats.html',
            controller: 'StatsCtrl'
          }
        }
      })

      .state('tab.forecast', {
        url: '/forecast',
        views: {
          'tab-forecast': {
            templateUrl: 'templates/tab-forecast.html',
            controller: 'ForecastCtrl'
          }
        }
      })

      .state('tab.calendar', {
        url: '/calendar',
        views: {
          'tab-calendar': {
            templateUrl: 'templates/tab-calendar.html',
            controller: 'CalendarCtrl'
          }
        }
      })

      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/tab/study');
    $urlRouterProvider.otherwise('/login');

  });
