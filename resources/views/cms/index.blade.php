<!DOCTYPE html>
<html>
  <head>
    @vite([
      'resources/scss/base.scss',
      'resources/js/app.js'
    ])
    <title>@yield('title')</title>
  </head>
  <body>
    <div class="frame" id="app">
      <app></app>
    </div>
  </body>
</html>