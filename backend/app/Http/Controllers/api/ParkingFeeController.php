<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Jobs\SendNotification;
use App\Models\Notification;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\User;
use App\Services\SendPushNotification;
use Carbon\Carbon;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class ParkingFeeController extends Controller
{
    private $fee, $code;
    
    public function __construct(Helper $helper, \Illuminate\Database\ConnectionInterface $db)
    {
        $this->fee = $db->table('settings')->where('key', 'parking_fee')->value('value');
        $this->code = $helper->generateCode();
    }

    public function pay()
    {
        $user = Auth::user();
        $sercurity = User::where('is_sercurity', 1)->first();

        try {
            DB::beginTransaction();

            $transaction = Transaction::create(
                [
                    'from_id' => $user->id,
                    'to_id' => $sercurity->id,
                    'amount' => Crypt::encryptString($this->fee),
                    'code' => Helper::generateNumber(),
                    'type' => 'P',
                    'title' => 'Trả tiền gửi xe',
                    'message' => null,
                    'qr_code' => $this->code,
                ]
            );

            $userWallet = $user->wallet;
            $userOpenBalance = $userWallet->balance;
            $userWallet->update([
                "balance" => $userOpenBalance - $this->fee
            ]);
            $userCloseBalance = $userWallet->balance;

            TransactionDetail::create([
                'transaction_id' => $transaction->id,
                'user_id' => $user->id,
                'open_balance' => $userOpenBalance,
                'close_balance' => $userCloseBalance,
            ]);

            $sercurityWallet = $sercurity->wallet;
            $sercurityOpenBalance = $sercurityWallet->balance;
            $sercurityWallet->update([
                "balance" => $sercurityOpenBalance + $this->fee
            ]); 
            $sercurityCloseBalance = $sercurityWallet->balance;

            TransactionDetail::create([
                'transaction_id' => $transaction->id,
                'user_id' => $sercurity->id,
                'open_balance' => $sercurityOpenBalance,
                'close_balance' => $sercurityCloseBalance,
            ]);

            DB::commit();
            return ApiResponse::successResponse($this->code);
        } catch (\Exception $e) {
            DB::rollBack();
            ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function scan(Request $request)
    {
        try {
            DB::beginTransaction();
            $sercurity = Auth::user();
            if($sercurity->is_sercurity !== 1)
            {
                ApiResponse::failureResponse('Đã có lỗi xảy ra');
            }

            $qr_code = $request->code;
            $transaction = Transaction::where('qr_code', $qr_code)->where('type', 'P')->first();
            if (!$transaction) {
                return ApiResponse::failureResponse('Mã không hợp lệ');
            }
            
            $transaction->update([
                "qr_code" => null
            ]);

            Notification::create([
                'user_id' => $transaction->from_id,
                'tag' => 'Gửi xe',
                'tag_model' => 'transactions',
                'tag_model_id' => $transaction->id,
                'title' => 'Gửi xe',
                'body' => 'Thanh toán tiền gửi xe thành công',
            ]);
            (new SendPushNotification)->userParking($transaction->fromUser, 'Thanh toán tiền gửi xe thành công');
            DB::commit();
            return ApiResponse::successResponse('valid');
        } catch(\Exception $e) {
            DB::rollBack();
            ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function checkQr(Request $request)
    {
        $user = Auth::user();
        $transaction = Transaction::where('from_id', $user->id)->where('qr_code', $request->code)->where('type', 'P')->first();
        return ApiResponse::successResponse(($transaction ? 'valid' : 'invalid'));
    }
}
