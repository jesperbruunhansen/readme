/**
 * Created by jesperbruun on 24/11/2015.
 */

var googleCalendar = angular.module("starter.googleCalendar", []);


googleCalendar.factory("GoogleCalendar", function () {

  // Your Client ID can be retrieved from your project in the Google
  // Developer Console, https://console.developers.google.com
  var CLIENT_ID = '310739854418-b8e53vn801jssr6k5vac0a3uii5th2ai.apps.googleusercontent.com';

  var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

  /**
   * Check if current user has authorized this application.
   */
  function checkAuth() {
    gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
      }, handleAuthResult);
  }

  /**
   * Handle response from authorization server.
   *
   * @param {Object} authResult Authorization result.
   */
  function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
      // Hide auth UI, then load client library.
      console.log("Authorized");
      loadCalendarApi();
    } else {
      console.log("error", authResult.error);
      // Show auth UI, allowing the user to initiate authorization by
      // clicking authorize button.
    }
  }

  /**
   * Initiate auth flow in response to user clicking authorize button.
   *
   * @param {Event} event Button click event.
   */
  function handleAuthClick(event) {
    gapi.auth.authorize(
      {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
      handleAuthResult);
    return false;
  }

  /**
   * Load Google Calendar client library. List upcoming events
   * once client library is loaded.
   */
  function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', listUpcomingEvents);
  }

  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  function listUpcomingEvents() {
    var request = gapi.client.calendar.events.list({
      'calendarId': 'jesperbbhansen@gmail.com',
      'timeMin': moment().format(),//new Date().toISOString(),
      'timeMax': moment().add('days', 1).format(),//new Date().toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    });

    request.execute(function(resp) {
      var events = resp.items;

      console.log(events);

      console.log("Upcomming events");

      if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
          var event = events[i];
          var when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          console.log(event.summary + ' (' + when + ')');
        }
      } else {
        console.log('No upcoming events found.');
      }

    });
  }

  return {
    checkAuth: checkAuth,
    init: handleAuthClick
  };

});
