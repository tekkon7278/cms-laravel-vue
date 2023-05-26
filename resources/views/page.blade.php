<!DOCTYPE html>
<html>
  <head>
    <title>TEST</title>
  </head>
  <body>
    @if ($list->isNotEmpty())
      @foreach ($list as $row) 
        {{$row->name}}
      @endforeach
    @else
      empty
    @endif
  </body>
</html>