<!DOCTYPE html>
<html>
  <head>
    @vite([
      'resources/scss/base.scss',
      'resources/js/app.js'
    ])
    <title>{{ $page->title() }}</title>
  </head>
  <body>
    <div class="frame" id="app">
      <page
        site-id="{{ $page->siteId() }}"
        page-id="{{ $page->id() }}"
      ></page>
    </div>
  </body>
</html>