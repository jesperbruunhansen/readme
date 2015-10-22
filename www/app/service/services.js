angular.module('starter.services', [])

  .factory('Courses', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var courses = [{
      id: 0,
      name: 'Virksomhedens økonomiske styring (5) (LA)',
      nextLecture: '21. October - 14.00'

    }, {
      id: 1,
      name: 'Innovation og ny teknologi (LA)',
      nextLecture: '22. October - 11.50'
    }, {
      id: 2,
      name: 'Personaleledelse (LA)',
      nextLecture: '19. October - 08.00'
    }, {
      id: 3,
      name: 'Google, Ebay, Amazon - Management Challenges in Networked Business (LA)',
      nextLecture: '21. October - 9.40',
      lectures: [
        {
          start: '28-09 12:35',
          end: '28-09 14:15'
        },
        {
          start: '28-09 14:25',
          end: '28-09 16:05'
        },
        {
          start: '02-10 11:40',
          end: '02-10 13:20'
        }
      ]
    }];

    return {

      all: function() {
        return courses;
      },
      remove: function(course) {
        courses.splice(courses.indexOf(course), 1);
      },
      get: function(courseId) {
        for (var i = 0; i < courses.length; i++) {
          if (courses[i].id === parseInt(courseId)) {
            return courses[i];
          }
        }
        return null;
      }
    };
  });
