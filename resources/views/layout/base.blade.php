<!DOCTYPE html>
<html>
  <head>
    @vite([
      'resources/scss/base.scss',
    ])
    <title>@yield('title')</title>
  </head>
  <body>
    <header>
      <h1>@yield('h1Title')</h1>
    </header>

    <div class="main">
      <div class="menu">
        <ul>
        @foreach ($pages as $page)
          <li><a href="/sites/{{$site->id()}}/pages/{{$page->id()}}">{{$page->title()}}</a></li>
        @endforeach
        </ul>
      </div>
      
      <div class="contents">
        @yield('contents')
      </div>
    </div>

    <footer>
    </footer>
  </body>
</html>