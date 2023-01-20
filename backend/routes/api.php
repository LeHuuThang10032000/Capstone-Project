<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\ScanQrCodeController;
use App\Http\Controllers\api\TransactionController;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\WalletController;
use App\Http\Controllers\api\CreditController;
use App\Http\Controllers\api\WithdrawController;
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
Route::post('/checkPassword', [AuthController::class, 'checkPassword']);

Route::group(['middleware' => ['auth:api']], function(){
    Route::post('/logout', [AuthController::class, 'logout']);

    //User
    Route::post('/update/{id}',[UserController::class, 'update']);
    Route::post('/updateProfile',[UserController::class, 'profileUpdate']);
    Route::get('/get-profile',[UserController::class, 'getProfile']);
    Route::post('/create-store', [UserController::class, 'createStoreRequest']);
    Route::get('/find-user/{phone}',[UserController::class, 'findUserById']);

    //Transaction
    Route::post('/create-transaction', [TransactionController::class, "transfer"]);

    //Scan qr code
    Route::post('/getInfoUser', [ScanQrCodeController::class, "getInfoUser"]);

    //wallet
    Route::get("/user-wallet",[WalletController::class, "showUserWallet"]);

    Route::post('/create-credit-request', [UserController::class, "createCreditRequest"]);

    //credit
    Route::post('create-credit-request', [CreditController::class, 'create']);

    //withdraw
    Route::post('create-withdraw-request', [WithdrawController::class, 'create']);
});

