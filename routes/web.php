<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

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

Route::get('/', [ProfileController::class, 'index'])->name('profile.view');
Route::get('/{profile?}', [ProfileController::class, 'show'])->name('profile.view');
Route::get('/fetch/{username}', [ProfileController::class, 'fetch'])->name('profile.fetch');
