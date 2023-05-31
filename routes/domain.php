<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers;

Route::get('{all}', [Controllers\DomainController::class, 'index']);

