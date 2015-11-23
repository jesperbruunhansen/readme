/**
 * Created by jesperbruun on 09/10/15.
 */

var model = angular.module("starter.model", []);

model.factory("Model", function () {

  var user = Parse.User.current();
  if (!user)
    throw Error("No user logged in");

  return {
    user: user,
    lectures: [],
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
        that.lectures = lectures;
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
          .include("lecture")
          .each(function (article) {
            articleList.push(article.get("article"));
          });

        chapterPromise = lecture
          .relation("chapters")
          .query()
          .include("chapter")
          .include("lecture")
          .each(function (chapter) {
            chapterList.push(chapter.get("chapter"));
          });
      });



      /*
       *  Resolve, when all promises are resolved
       */
      Parse.Promise.when(articlePromise, chapterPromise).then(function () {

        console.log(articleList, chapterList);

        promise.resolve({
          hasArticlesBeenRead: function () {
            return that.hasArticleBeenRead(articleList);
          },
          hasChaptersBeenRead: function () {
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

      var promise = new Parse.Promise();
      var query = new Parse.Query("RegsArticle");
      query.equalTo("user", this.user);
      query.containedIn("article", articles);
      query.find().then(function (regsArticles) {

        var articleList = [];

        /*
         * Find the chapter registration
         */
        regsArticles.forEach(function (regsArticle) {
          articles.forEach(function (article) {
            if (article.id === regsArticle.get("article").id) {
              articleList.push({
                chapter: article,
                id: article.id,
                isRead: article.get("endPage") === regsArticle.get("to")
              });

              /*
               * When the article has been found, remove it from the array
               */
              articles.splice(articles.indexOf(article), 1);
            }
          });
        });

        /*
         * Take remaining articles and pass to the list
         *
         * We assume, that if no registrations has been made,
         * the article has not been read.
         */
        articles.forEach(function (article) {
          articleList.push({
            article: article,
            id: article.id,
            isRead: false
          });
        });

        promise.resolve(articleList);

      }, function (err) {
        promise.reject(err);
        console.log(err)
      });

      return promise;

    },
    hasChapterBeenRead: function (chapters) {

      var promise = new Parse.Promise();
      var query = new Parse.Query("RegsChapter");
      query.equalTo("user", this.user);
      query.containedIn("chapter", chapters);
      query.find().then(function (regsChapters) {
        var chapterList = [];

        /*
         * Find the chapter registration
         */
        regsChapters.forEach(function (regsChapter) {
          chapters.forEach(function (chapter) {
            if (chapter.id === regsChapter.get("chapter").id) {
              chapterList.push({
                chapter: chapter,
                id: chapter.id,
                isRead: chapter.get("endPage") === regsChapter.get("to")
              });

              /*
               * When the chapter has been found, remove it from the array
               */
              chapters.splice(chapters.indexOf(chapter), 1);
            }
          });
        });

        /*
         * Take remaining chapters and pass to the list
         *
         * We assume, that if no registrations has been made,
         * the chapter has not been read.
         */
        chapters.forEach(function (chapter) {
          chapterList.push({
            chapter: chapter,
            id: chapter.id,
            isRead: false
          });
        });


        promise.resolve(chapterList);

      }, function (err) {
        promise.reject(err);
        console.log(err)
      });

      return promise;

    },
    hasReadingBeenPlanned: function (articles, chapters) {

      var promise = new Parse.Promise();
      var missingArticles = [];
      var missingChapters = [];

      /*
       * Remove everything that has been read.
       */
      articles.forEach(function (article) {
        if (!article.isRead)
          missingArticles.push(article.article);
      });
      chapters.forEach(function (chapter) {
        if (!chapter.isRead)
          missingChapters.push(chapter.chapter);
      });

      /*
       * Remove everything that has been read.
       */
      if (missingArticles.length == 0 && missingChapters.length == 0) {
        promise.resolve({
          allPlanned: true
        });
        return promise;
      }


      /*
       * Find all readings, which already has been planned
       */
      var articleQuery = new Parse.Query("Calendar");
      articleQuery.containedIn("article", missingArticles);

      var chapterQuery = new Parse.Query("Calendar");
      chapterQuery.containedIn("chapter", missingChapters);

      var query = new Parse.Query.or(articleQuery, chapterQuery);
      query.equalTo("user", this.user);
      query.find().then(function (plannedReadings) {

        var articles = [],
          arrObj = {},
          chapters = [],
          chapObj = {};

        /*
        * Sort each reading by article or chapter
        */
        _.each(plannedReadings, function (reading) {
          if (reading.get("article")) {
            articles.push(reading.get("article"));
            arrObj[reading.get("article").id] = true
          }
          if (reading.get("chapter")) {
            chapters.push(reading.get("chapter"));
            chapObj[reading.get("chapter").id] = true;
          }
        });

        /*
        *  Sort missing articles by present plannedreadings
        */
        var notPlannedArticles = _.reject(missingArticles, function (missingArticle) {
          return arrObj[missingArticle.id];
        });
        var notPlannedChapters = _.reject(missingChapters, function (missingChapter) {
          return chapObj[missingChapter.id];
        });

        /*
        *  Resolve
        */
        promise.resolve({
          allPlanned:false,
          plannedArticles: articles,
          plannedChapters: chapters,
          notPlannedArticles: notPlannedArticles,
          notPlannedChapters: notPlannedChapters
        });


      }, function (err) {
        promise.reject(err);
        console.log(err)
      });

      return promise;

    },
    prioritizeReadings: function (articles, chapters) {
      console.log(articles, chapters);
      console.log(this.lectures);
    }


  };

});
