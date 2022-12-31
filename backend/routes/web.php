<?php

use App\Http\Controllers\Resources\OrganiserController;
use App\Http\Controllers\Resources\UserController;
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

Route::get('/', function () {
    return view('auth.login');
})->name('login');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

require __DIR__.'/auth.php';

Route::group(['middleware' => ['auth', 'role:organiser']], function() {
    Route::resource('user', UserController::class);

    Route::put('user/activate/{id}', [OrganiserController::class, 'deactivateUser'])->name('organiser.activate-user');
    
    Route::group(['prefix' => 'store-request'], function() {
        Route::get('', [OrganiserController::class, 'getStoreRequests'])->name('organiser.store-request');
        Route::post('approve', [OrganiserController::class, 'approveStore'])->name('organiser.store-request.approve');
        Route::post('deny', [OrganiserController::class, 'denyStore'])->name('organiser.store-request.deny');
    });
});