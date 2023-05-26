<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

Route::redirect('/', '/cms/sites');
Route::view('/cms/sites', 'cms.index');
Route::view('/cms/sites/{siteId}/{type?}', 'cms.index');
Route::view('/cms/sites/{siteId}/pages/{pageId}', 'cms.index');

Route::get('/sites/{siteId}', [Controllers\IndexController::class, 'index']);
Route::get('/sites/{siteId}/pages/{pageId}', [Controllers\IndexController::class, 'index']);

Route::get('/api/path', [Controllers\Reource\PageController::class, 'showByPathname']);

Route::get('{all}', [Controllers\DomainController::class, 'index']);
// Route::get('{all}', [Controllers\DomainController::class, 'index']);

