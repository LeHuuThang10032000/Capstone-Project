<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\ScanQrCodeController;
use App\Http\Controllers\api\TransactionController;
use App\Http\Controllers\api\UserController;
use App\Models\Transaction;
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
Route::post('/check-phone',[AuthController::class, 'checkPhoneExist']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::group(['middleware' => ['auth:api']], function(){
    Route::post('/logout', [AuthController::class, 'logout']);

    //User
    Route::post('/update/{id}',[UserController::class, 'update']);
    Route::post('/updateProfile',[UserController::class, 'profileUpdate']);
    Route::get('/get-profile',[UserController::class, 'getProfile']);
    Route::post('/create-store', [UserController::class, 'createStoreRequest']);

    //Transaction
    Route::post('/create-transaction', [TransactionController::class, "transfer"]);

    //Scan qr code
    Route::post('/getInfoUser', [ScanQrCodeController::class, "getInfoUser"]);

    Route::get('/test', function() {
        return 'test';
    });
});

