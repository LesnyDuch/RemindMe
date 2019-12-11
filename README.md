# RemindMe
Location based Reminder 

## How to run the application
As Google's Firebase authentication doesn't allow authentication from a `file://` location (e.g. right-clicking the file and opening it in a browser), it's necessary for the application to be running inside a server (localhost is enough, using Apache https://www.apachefriends.org/es/index.html for instance), which then serves the application as a website.

**Note to Radu:** It's enough if you put the application on the server you use for the lectures. For any questions, write us an email.

## Features
The application supports following features:
* Authentication using Google
* If the user is logged in the user profile will change into the pic that has the user in the Google account
* Adding location-based remainders with custom text
  * Clicking on a note's title centers the map on the corresponding marker on the map
  * Clicking on a marker highlights it's corresponding note
  * Number of nearby reminders is displayed in the top left corner as a number in the red badge
  * Nearby reminders are highlighted in the note list
  * User's current location is displayed at all times (refreshed every 5 seconds)
* Storing data using Firebase database (meaning it can be used on multiple devices, although that specific functionality may not yet work properly, due to our attempt to keep database loading operations to a minimum) and localStorage if not logged in
* Responsive UI - on narrower screens the sidebar collapses and is triggerable by the hamburger icon in the top left corner. For the UI to work properly we advice refreshing the page if the screen resolution is changed.