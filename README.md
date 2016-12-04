# Gradle Update [![CircleCI](https://circleci.com/gh/int128/gradleupdate-v2.svg?style=svg)](https://circleci.com/gh/int128/gradleupdate-v2) [![Gradle Status](https://gradleupdate.appspot.com/int128/gradleupdate-v2/status.svg?branch=master)](https://gradleupdate.appspot.com/int128/gradleupdate-v2/status)

Gradle Update keeps the latest Gradle Wrapper by pull requests for your repositories on GitHub.

Visit https://gradleupdate.appspot.com

Note:
In past adding a star on this repository triggered a new pull request, but it has no effect now.
Feel free to star this repository!


## How works

### When a _user_ requested update for a _repository_

1. Receive a request for _repository_.
  1. Check if _user_ have permission to push to the _repository_.
  2. Check if Gradle Update have permission to pull from the _repository_.
  3. Queue a task for the _repository_.
2. In a task,
  1. Check if the _repository_:_default-branch_ does not have the latest version of Gradle Wrapper.
  2. Fork the _repository_ as _fork_ and sync _default-branch_ to upstream.
  3. Create or update a commit with the latest version of Gradle Wrapper as _fork_:_gradle-branch_.
  4. Create or update a pull request from _fork_:_gradle-branch_ onto _repository_:_default-branch_.


### Periodically

1. Check the latest version of Gradle from [services.gradle.org](https://services.gradle.org).
2. If a new version of Gradle is found,
  1. Trigger updating Gradle Wrapper on [latest-gradle-wrapper](https://github.com/int128/latest-gradle-wrapper).
  2. Wait until the new version is available on [latest-gradle-wrapper](https://github.com/int128/latest-gradle-wrapper).
  3. Get a list of repositories to be updated and queue tasks for each _repository_.


### When a badge for the _repository_ is requested,

1. Check the version of Gradle Wrapper in the _repository_.
2. If it is up-to-date, respond the green image.
3. If it is out-of-date, respond the red image.
4. If it has no Gradle Wrapper, respond the grey image.


## Architecture

* React
* Gaelyk
* App Engine
* Spock
* Webpack
* Babel
* Gradle

Git operations are performed via GitHub API. It requires no filesystem or git command.

All operations are performed on Task Queue and designed to be transactional and idempotence. Any exception such as HTTP error may occur during an operation but will be recovered by retrying.


## Contribution

Gradle Update is an open source software licensed under the Apache License Version 2.0. Feel free to open issues or pull requests.


How to Run
----------

Build and run App Engine development server.

```bash
npm run watch
./gradlew appengineRun
```

We can run Webpack development server instead.

```bash
npm run start
```

How to Deploy
-------------

Push the master branch and Circle CI will deploy the app to App Engine.

A service account key should be provided during CI.
Open [Google Cloud Platform Console](https://console.cloud.google.com/iam-admin/serviceaccounts) and create a service account.
Then, encode the JSON key as follows and store it into the environment variable `APPENGINE_KEY` on Circle CI.

```bash
base64 -b0 appengine-key.json
```

Build system
------------

Sources:

* Frontend
  * `/src/main/js` - JSX and Less code
  * `/static` - Static files
* Backend
  * `/src/main/groovy` - Production code
  * `/src/main/groovlet` - Production code (Groovlet)
  * `/src/main/config` - Configuration files
  * `/src/test/groovy` - Test code

Artifacts:

Destination                             | Source                                | Builder
----------------------------------------|---------------------------------------|---------
`/build/exploded-app`                   | `/static`                             | Webpack
`/build/exploded-app/react.min.js`      | dependencies                          | Webpack
`/build/exploded-app/app.js`            | `/src/main/js` and dependencies       | Webpack
`/build/exploded-app/WEB-INF`           | `/src/main/config`                    | Gradle
`/build/exploded-app/WEB-INF/lib`       | `/src/main/groovy` and dependencies   | Gradle
`/build/exploded-app/WEB-INF/groovy`    | `/src/main/groovlet`                  | Gradle and Webpack
`/build/local_db.bin`                   | -                                     | App Engine Dev Server
