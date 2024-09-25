# Meeting Scheduler

Members of an organization can make and view meetings or class schedules in browsers on desktops, tablets, and smartphones.

* Meeting attendees can be selected conveniently in drop-down menus when scheduling meetings. All scheduled participants will have the meetings automatically added to their schedules, viewable when they log in. 
* Personalized meeting times and dates are displayed for each user. 
* Select a first meeting date, days of the week on which to hold the meetings, and number of weeks, and all successive meeting days and dates will be automatically calculated and scheduled.
* Authenticated sign up and login.
* Content Security Policy helps protects the front end from inline script and style hacks and Cross Site Request Forgery protection also helps protect the site.

This project uses React, Javascript, Django, Python, Nginx, PostgreSQL, Webpack, Flexbox, SCSS, Session Authentication, and Content Security Policy (CSP).

![schedulerpage.png](https://github.com/tom4244/meeting_scheduler/blob/main/src/app/img/schedulerpage.png?raw=true)

# Installation
* The site uses a React front end with a Django server back end and an Nginx server as a reverse proxy. Django is configured in the settings.py file as usual. The Django Rest Framework Quickstart and Tutorial and Django First Steps tutorials can be used as a good starting point, and along with the settings in the settings.py file, Django will create the auth_user table in the postgres database. 
* Create the postgres tables "person", "session", and "session_entry" using the included "example_tables.txt" and the Person, Session, and SessionEntry models in the meeting/scheduler/models.py file.
* An example nginx.conf file for Nginx server configuration with a proxy pass set up is included. 
* Create a PostgreSQL database with tables and table columns as in the included example_tables.txt example file.  
* The project is configured by default for localhost http to enable a quick setup for local experimentation, but with necessary changes for https included in comments. 
* Install Django.
* Run "yarn install" to install all needed nodejs packages and dependencies and create the node_modules directory that contains them.
* Start the Nginx server (if used) and PostgreSQL database.
* Webpack configuration is in meeting_scheduler/meeting/React/webpack.config.js and should work as is. 
* Note the npm scripts in meeting/React/package.json that will create the webpack bundle and start the React front end.
* Run "npm start dev" from a terminal in the meeting_scheduler/meeting/React directory to create the Webpack bundle and start the client. 
* Run "python manage.py runserver" from a terminal in the meeting_scheduler/meeting directory to start the Django back end.
* If the site is being run on localhost (the default) with default settings, the site will be viewable on http://localhost:8000. 

# Notes
* To protect the site from inline scripting and styling hacks, inline scripting and styling were minimized and Content Security Policy (CSP) was implemented. Styled Components (SC) was originally used, but since it functions primarily by creating inline styling, it was converted to SCSS files for better security.
