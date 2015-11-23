/**
 * Created by jesperbruun on 18/11/15.
 */

var data = angular.module("starter.data", []);
data.factory("Data", function () {

  var user = Parse.User.current();

  function Forecast(){
  }


  Forecast.loadAllCourses = function () {

    var promise = new Parse.Promise();
    var query = new Parse.Query("UserCourse");
    var courses = [];
    query.include("course");
    query.equalTo("user", user);
    query.each(function (course) {
      var c = new Course();
      c.setFromParse(course);
      courses.push(c);
    }).then(function () {
      var forecast = new Forecast();
      forecast.Courses = courses;
      promise.resolve(forecast);
    }, function (err) {
      promise.reject(err);
    });

    return promise;
  };


  function Course() {

  }
  Course.loadLectures = function (forecast) {

    /*
     *  Define timespan
     */
    var timeSpan = 7;
    var d = new Date("2015/09/24"); //Testing purpose
    var start = new moment(d);
    start.startOf('day');
    var finish = new moment(start);
    finish.add('days', timeSpan);

    var lecturePromises = [];
    var promise = new Parse.Promise();
    var query = new Parse.Query("Lecture");
    query.greaterThanOrEqualTo('start', start.toDate());
    query.lessThan('end', finish.toDate());

    forecast.Courses.forEach(function (course) {

      course.Lectures = [];
      query.equalTo("course", course.course);
      var q = query.each(function(lecture){

        var l = new Lecture();
        l.setFromParse(lecture);
        course.Lectures.push(l);

      });
      lecturePromises.push(q);
    });

    Parse.Promise.when(lecturePromises).then(function () {
      promise.resolve(forecast);
    }, function (err) {
      promise.reject(err);
    });

    return promise;

  };


  Course.prototype.setFromParse = function (parseObj) {
    this.id = parseObj.get("course").id;
    this.courseId = parseObj.get("course").get("courseId");
    this.course = parseObj.get("course");
    this.name = parseObj.get("course").get("name");
  };



  function Lecture() {

  }

  Lecture.prototype.setFromParse = function (parseObj) {
    this.id = parseObj.id;
    this._start = parseObj.get("start");
    this._end = parseObj.get("end");
    this.start = moment(this._start).format('D. MMM YYYY, h:mm a');
    this.end = moment(this._end).format('D. MMM YYYY, h:mm a');
    this.articles = parseObj.relation("articles");
    this.chapters = parseObj.relation("chapters");
  };

  Lecture.loadSyllabuses = function (forecast) {

    var promise = new Parse.Promise();

    var syllabusPromises = [];
    forecast.Courses.forEach(function (course) {
      course.Lectures.forEach(function (lecture) {

        var s = lecture.getSyllabus();
        syllabusPromises.push(s);

      });
    });

    Parse.Promise.when(syllabusPromises).then(function () {

      promise.resolve(forecast);

    }, function (err) {
      console.log(err);
      promise.reject(err);
    });

    return promise;

  };

  Lecture.getAllSyllabuses = function (lectures) {

    var promise = new Parse.Promise();
    var allSyllabuses = [];
    lectures.forEach(function (lecture) {
      var s = lecture.getSyllabus();
      allSyllabuses.push(s);
    });

    Parse.Promise.when(allSyllabuses).then(function () {
      var result = [];
      for (var i = 0; i < arguments.length; i++) {
        result = result.concat(arguments[i]);
      }
      promise.resolve(lectures);
    }, function (err) {
      promise.reject(err);
    });

    return promise;
  };

  Lecture.getAllFrom = function (courses) {

    var courseList = [];
    courses.forEach(function (course) {
      courseList.push(course.course);
    });

    /*
     *  Define timespan
     */
    var timeSpan = 7;
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
    var lectureList = [];
    query.greaterThanOrEqualTo('start', start.toDate());
    query.lessThan('end', finish.toDate());
    query.containedIn("course", courseList);
    query.each(function (lecture) {
      var l = new Lecture();
      l.setFromParse(lecture);
      lectureList.push(l);
    }).then(function () {
      promise.resolve(lectureList);
    }, function (err) {
      promise.reject(err);
    });

    return promise;

  };

  Syllabus.loadStatus = function (forecast) {

    var promise = new Parse.Promise();
    var promiseList = [];

    forecast.Courses.forEach(function (course) {
      course.Lectures.forEach(function (lecture) {
        lecture.Syllabus.forEach(function(syllabus){
          var p = syllabus.isRead();
          promiseList.push(p);
        });
      });
    });

    Parse.Promise.when(promiseList).then(function () {

      promise.resolve(forecast);

    }, function (err) {
      promise.reject(err);
    });

    return promise;

  };

  Lecture.prototype.isSyllabusRead = function () {

    var promise = new Parse.Promise();
    var syllabusList = [];
    var self = this;

    this.Syllabus.forEach(function (syllabus) {
      var s = syllabus.isRead();
      syllabusList.push(s);
    });

    Parse.Promise.when(syllabusList).then(function () {

      promise.resolve();

    }, function (err) {
      console.log(err);
      promise.reject(err);
    });

    return promise;

  };

  Lecture.prototype.getSyllabus = function () {

    var self = this;
    var syllabusList = [];
    var promise = new Parse.Promise();

    var articles = this.articles
      .query()
      .include("article")
      .each(function (article) {
        var a = new Article();
        a.setFromParse(article.get("article"));
        syllabusList.push(a);
      });

    var chapters = this.chapters
      .query()
      .include("chapter")
      .each(function (chapter) {
        var c = new Chapter();
        c.setFromParse(chapter.get("chapter"));
        syllabusList.push(c);
      });

    Parse.Promise.when(articles, chapters).then(function () {

      self.Syllabus = syllabusList;

      promise.resolve();

    }, function (err) {
      console.log(err);
      promise.reject(err);
    });

    return promise;

  };

  function Syllabus() {

  }

  Syllabus.prioritize = function (lectures) {
    var promise = new Parse.Promise();
    var syllabusList = [];

    lectures.forEach(function (lecture) {
      lecture.Syllabus.forEach(function (syllabus) {

        if (!syllabus.isRead) {

          var s = new Syllabus();
          s.type = syllabus.type;
          s.id = syllabus.id;
          s.title = syllabus.title;
          s.lecture = {
            start: lecture.start,
            end: lecture.end
          };

          syllabusList.push(s);
        }

      });
    });

    var foo = syllabusList.sort(function (a, b) {
      return a.lecture.start.getTime() - b.lecture.start.getTime();
    });
    promise.resolve(foo);
    return promise;
  };

  Syllabus.hasAllBeenPlanned = function (forecast) {

    var promise = new Parse.Promise();
    var syllabusList = [];

    forecast.Courses.forEach(function (course) {
      course.Lectures.forEach(function (lecture) {
        lecture.Syllabus.forEach(function (syllabus) {

          var s = syllabus.hasBeenPlanned();
          syllabusList.push(s);

        });
      })
    });

    Parse.Promise.when(syllabusList).then(function(){
      promise.resolve(forecast);
    }, function (err) {
      promise.reject(err);
    });

    return promise;

  };

  Syllabus.prototype.setFromParse = function (parseObj) {
    this.endPage = parseObj.get("endPage");
    this.startPage = parseObj.get("startPage");
    this.title = parseObj.get("title");
    this.id = parseObj.id;
    this.chapterNr = parseObj.get("chapter");
  };


  Syllabus.prototype.hasBeenPlanned = function () {

    var promise = new Parse.Promise();
    var self = this;
    var query = new Parse.Query("Calendar");
    var syllabus = {};

    if(this.type === "article"){
      syllabus = Parse.Object.extend("Article").createWithoutData(this.id);
    }
    else {
      syllabus = Parse.Object.extend("Chapter").createWithoutData(this.id);
    }

    query.equalTo("user", user);
    query.equalTo(this.type, syllabus);
    query.find().then(function (syllabus) {

      self.hasBeenPlanned = !!syllabus.length;
      promise.resolve();

    }, function (err) {
      console.log(err);
    });

    return promise;

  };

  Syllabus.prototype.isRead = function () {

    var self = this;
    var query = {};
    var syllabus = {};
    var promise = new Parse.Promise();

    switch (this.type) {
      case "chapter":
        query = new Parse.Query("RegsChapter");
        syllabus = Parse
          .Object
          .extend("Chapter")
          .createWithoutData(this.id);
        break;
      case "article":
        query = new Parse.Query("RegsArticle");
        syllabus = Parse
          .Object
          .extend("Article")
          .createWithoutData(this.id);
        break;
      default:
        throw Error("No Type was found on Syllabus object");
        break;
    }

    query.equalTo("user", user);
    query.equalTo(this.type, syllabus);
    query.find().then(function (syllabus) {

      if (syllabus[0]) {
        self.isRead = syllabus[0].get("to") === self.endPage;
      }
      else {
        self.isRead = false;
      }

      promise.resolve();

    }, function (err) {
      promise.reject(err);
      console.log(err);
    });

    return promise;

  };

  function Article() {
    this.type = "article";
    Syllabus.call(this);
  }

  Article.prototype = Object.create(Syllabus.prototype);

  function Chapter() {
    this.type = "chapter";
    Syllabus.call(this);
  }

  Chapter.prototype = Object.create(Syllabus.prototype);

  return {
    Forecast:Forecast,
    Course:Course,
    Lecture:Lecture,
    Syllabus: Syllabus
  };


});
