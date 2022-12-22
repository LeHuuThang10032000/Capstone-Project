<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);

Route::prefix('/v1')->group(function(){
    Route::post('/logout', [AuthController::class, 'logout']);

    //User
    Route::post('/update/{id}',[UserController::class, 'update']);
    Route::post('/updateProfile/{id}',[UserController::class, 'profileUpdate']);
});

