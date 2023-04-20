<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\ScanQrCodeController;
use App\Http\Controllers\api\TransactionController;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\WalletController;
use App\Http\Controllers\api\CreditController;
use App\Http\Controllers\api\WithdrawController;
use App\Http\Controllers\api\FriendsController;
use App\Http\Controllers\api\NotificationController;
use App\Http\Controllers\api\StoreController;
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
    Route::get('/search', [UserController::class, 'search']);
    //User
    Route::post('/update/{id}',[UserController::class, 'update']);
    Route::post('/updateProfile',[UserController::class, 'profileUpdate']);
    Route::get('/get-profile',[UserController::class, 'getProfile']);
    Route::post('/create-store', [UserController::class, 'createStoreRequest']);
    Route::get('/get-request-create-store', [UserController::class, 'checkUserSendRequestCreateStore']);
    Route::get('/find-user/{phone}',[UserController::class, 'findUserById']);
    Route::get('/search-user',[UserController::class, 'searchUser']);
    Route::get('/users',[UserController::class, 'index']);

    //Transaction
    Route::post('/create-transaction', [TransactionController::class, "transfer"]);
    Route::get('/history-transaction', [TransactionController::class, "history"]);

    //Scan qr code
    Route::post('/getInfoUser', [ScanQrCodeController::class, "getInfoUser"]);

    //wallet
    Route::get("/user-wallet",[WalletController::class, "showUserWallet"]);

    Route::post('/create-credit-request', [UserController::class, "createCreditRequest"]);

    //withdraw
    Route::post('/create-withdraw-request', [WithdrawController::class, 'create']);
    Route::get('/withdraw-history', [WithdrawController::class, 'histories']);
    Route::get('/withdraw-history/{id}', [WithdrawController::class, 'detail']);

    //friends
    Route::get('friends', [FriendsController::class, 'index']);
    Route::post('friends', [FriendsController::class, 'store']);
    Route::post('unfriend', [FriendsController::class, 'destroy']);
    Route::post('friends/accept', [FriendsController::class, 'accept']);

    Route::apiResource('notification', NotificationController::class);

    Route::group(['prefix' => 'merchant'], function() {
        Route::get('/store', [StoreController::class, 'index']);
        Route::post('/store/update', [StoreController::class, 'update']);
        Route::post('/store/update/status', [StoreController::class, 'updateStoreStatus']);

        Route::get('/menu', [StoreController::class, 'getStoreMenu']);
        Route::post('/product/create', [StoreController::class, 'createProduct']);
        Route::post('/product/update', [StoreController::class, 'updateProduct']);

        Route::get('/product-category', [StoreController::class, 'getProductCategory']);
        Route::post('/product-category/create', [StoreController::class, 'createProductCategory']);
        Route::post('/product-category/update', [StoreController::class, 'updateProductCategory']);
        Route::post('/product-category/delete', [StoreController::class, 'deleteProductCategory']);

        Route::get('/add-on', [StoreController::class, 'getAddOn']);
        Route::post('/add-on/create', [StoreController::class, 'createAddon']);
        Route::post('/add-on/update', [StoreController::class, 'updateAddon']);
        Route::post('/add-on/delete', [StoreController::class, 'deleteAddon']);

        Route::get('/activate-time', [StoreController::class, 'getTimeActive']);
        Route::post('/activate-time', [StoreController::class, 'updateTimeActive']);

        Route::get('/promocode', [StoreController::class, 'getPromocode']);
        Route::post('/promocode/create', [StoreController::class, 'createPromocode']);
        Route::post('/promocode/update', [StoreController::class, 'updatePromocode']);
        Route::post('/promocode/cancel', [StoreController::class, 'cancelPromocode']);

        Route::get('/order', [StoreController::class, 'getOrder']);
        Route::get('/order/detail', [StoreController::class, 'getOrderDetail']);
        Route::get('/history-order', [StoreController::class, 'getHistoryOrder']);
        Route::post('/order/update-status', [StoreController::class, 'updateOrderStatus']);
    });

    Route::group(['prefix' => 'store'], function() {
        Route::get('', [UserController::class, 'getStores']);
        Route::get('/{id}', [UserController::class, 'getStoreDetail']);
    });

    Route::group(['prefix' => 'product'], function() {
        Route::get('/{id}', [UserController::class, 'getProductDetail']);
    });

    Route::group(['prefix' => 'order'], function() {
        Route::get('', [UserController::class, 'getOrder']);
        Route::get('/calc-order', [UserController::class, 'calcOrderTotal']);
        Route::get('/detail', [UserController::class, 'getOrderDetail']);
        Route::post('/create-order', [UserController::class, 'createOrder']);
        Route::post('/cancel-order', [UserController::class, 'cancelOrder']);
        Route::post('/taken-order', [UserController::class, 'takenOrder']);
    });

    Route::group(['prefix' => 'cart'], function() {
        Route::get('', [UserController::class, 'getCart']);
        Route::post('', [UserController::class, 'addToCart']);
        Route::put('', [UserController::class, 'updateCart']);
        Route::delete('', [UserController::class, 'deleteCart']);
    });

    Route::group(['prefix' => 'share-bill'], function() {
        Route::get('', [UserController::class, 'getShareBill']);
        Route::get('/my-share-bill', [UserController::class, 'getMyShareBill']);
        Route::get('paid', [UserController::class, 'getPaidShareBill']);
        Route::get('detail', [UserController::class, 'getShareBillDetail']);
        Route::post('', [UserController::class, 'createShareBill']);
        Route::post('pay', [UserController::class, 'payShareBill']);
        Route::post('remind', [UserController::class, 'remindPayShareBill']);
    });

    Route::get('/promocode', [UserController::class, 'getStorePromocode']);
});

