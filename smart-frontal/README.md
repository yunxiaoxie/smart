# Smart Frontal

## 前端工程简介

- 前端工程采用gulp/npm管理项目

## Dependencies
- bower install --install js dependents to local lib dir.
- npm install --install dependents to local node_modules dir.

## How to run
- gulp --start web server for dev.
- gulp xxx --run the tasks of project.

## add suffix support for resolving cache issue, like main-73a4a64b04.css
- gulp dev
  - build css and js files, then replace html and js files, such as index.html, main-*.js.
  - The css and js are not be compressed for dev.

- gulp build
  - The css and js are compressed for release.