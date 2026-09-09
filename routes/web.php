<?php

use App\Http\Controllers\AppController;
use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - FinTrack (Ngaturuang)
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group.
|
*/

// Landing Page
Route::get('/', [LandingController::class, 'index'])->name('home');

// FinTrack Pro Application Dashboard
Route::get('/app', [AppController::class, 'index'])->name('app');

// Compatibility Redirects
Route::get('/feature', fn() => redirect()->route('app'));
Route::get('/feature.html', fn() => redirect()->route('app'));
Route::get('/index.html', fn() => redirect()->route('home'));
Route::get('/dashboard', fn() => redirect()->route('app'));
