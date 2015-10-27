/**
 * Created by jesperbruun on 23/09/15.
 */


var service = angular.module("starter.dataService", [])
  .factory("dataService", function(){

    return {

      getAllCoursesFromUser: function(){

        var promise = new Parse.Promise();
        var user = Parse.User.current();
        var query = new Parse.Query("UserCourse");
        query.include("course");
        query.equalTo("user", user);
        query.find().then(function(courses){

          var courseList = [];
          courses.forEach(function (course) {
            courseList.push({
              courseId: course.get("course").get("courseId"),
              courseName: course.get("course").get("name"),
              id: course.id
            });
          });

          promise.resolve(courseList);

        }, function (err) {
          promise.reject(err);
          console.log(err);
        }); //added a comment

        return promise;

      }

    }

  }
);
