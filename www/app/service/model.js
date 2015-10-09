/**
 * Created by jesperbruun on 09/10/15.
 */

var model = angular.module("starter.model", []);

model.factory("Model", function () {

  var user = Parse.User.current() || "test";
  if (!user)
    throw Error("No user logged in");

  return {
    user: user,
    getCourses: function () {
      var that = this;

      /*
       *  Do query
       */
      var promise = new Parse.Promise();
      var query = new Parse.Query("UserCourse");
      query.include("course");
      query.equalTo("user", this.user);
      query.find().then(function (courses) {

        /*
         *  Resolve
         */
        promise.resolve({

          //Chain ve
          findUpcomingLectures: function (days) {
            var courseList = [];
            courses.forEach(function (course) {
              var Course = new Parse.Object.extend("Course");
              var courseRef = Course.createWithoutData(course.get("course").id);
              courseList.push(courseRef);
            });

            return that.upcomingLectures(courseList, days);
          },

          info: function () {
            var courseList = [];
            courses.forEach(function (course) {
              var pretty = {
                id: course.get("course").id,
                name: course.get("course").get("name"),
                courseId: course.get("course").get("courseId")
              };
              courseList.push(pretty);
            });

            return courseList;
          }
        });
      }, function (err) {
        promise.reject(err);
        console.log(err)
      });

      return promise;
    },
    upcomingLectures: function (courses, days) {

      var that = this;

      /*
       *  Define timespan
       */
      var timeSpan = days || 7;
      var d = new Date("2015/09/24"); //Testing purpose
      var start = new moment(d);
      start.startOf('day');
      var finish = new moment(start);
      finish.add('days', timeSpan);

      /*
       *  Do query
       */
      var promise = new Parse.Promise();
      var query = new Parse.Query("Lecture");
      query.greaterThanOrEqualTo('start', start.toDate());
      query.lessThan('end', finish.toDate());
      query.containedIn("course", courses);
      query.find().then(function (lectures) {
        promise.resolve({
          getLectureContent: function () {
            return that.getLectureContent(lectures);
          }
        });
      }, function (err) {
        promise.reject(err);
        console.log(err)
      });

      return promise;

    },
    getLectureContent: function (lectures) {

      var that = this;
      var promise = new Parse.Promise();
      var articleList = [];
      var chapterList = [];
      var articlePromise = {};
      var chapterPromise = {};

      /*
       *  Go trough each lecture
       */
      lectures.forEach(function (lecture) {

        articlePromise = lecture
          .relation("articles")
          .query()
          .include("article")
          .each(function (article) {
            articleList.push(article.get("article"));
          });

        chapterPromise = lecture
          .relation("chapters")
          .query()
          .include("chapter")
          .each(function (chapter) {
            chapterList.push(chapter.get("article"));
          });
      });

      /*
       *  Resolve, when all promises are resolved
       */
      Parse.Promise.when(articlePromise, chapterPromise).then(function () {
        promise.resolve({
          hasArticlesBeenRead: function () {
            return that.hasArticleBeenRead(articleList);
          },
          hasChaptersBeenread: function () {
            return that.hasChapterBeenRead(chapterList);
          }
        });
      }, function (err) {
        promise.reject(err);
        console.log(err);
      });

      return promise;

    },
    hasArticleBeenRead: function (articles) {

      console.log(articles);

      var query = new Parse.Query("RegsArticle");
      query.equalTo("user", this.user);
      query.containedIn("article", articles);
      query.find().then(function (article) {
        console.log(article);
      }, function (err) {
        console.log(err)
      });


    },
    hasChapterBeenRead: function (chapters) {

    }


  };

});
