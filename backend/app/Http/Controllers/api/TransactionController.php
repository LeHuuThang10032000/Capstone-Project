<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Models\Notification;
use App\Models\ShareBill;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\User;
use App\Models\Wallet;
use App\Services\SendPushNotification;
use Carbon\Carbon;
use Exception;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use function Ramsey\Collection\Map\replace;

class TransactionController extends Controller
{

    //check password during process transaction
    public function checkPwd(Request $request)
    {
        $request->validate([
            "password" => "required"
        ]);
        $user = Auth::user();
        if (Hash::check($user->password, $request->password)) {
            return response([
                "message" => "Mật khẩu xác thực thành công"
            ]);
        }
        return response([
            "message" => "Sai mật khẩu"
        ], 422);
    }

    public function transfer(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'phone' => 'required|phone',
            'cash' => 'required|integer|min:100',
            'message' => 'max:255',
            'payment_type' => 'required|in:T,S',
            'share_id' => 'required_if:payment_type,==,S|integer',
        ], [
            'phone.phone' => 'Số điện thoại không đúng định dạng'
        ]);

        if ($validate->fails()) {
            return ApiResponse::failureResponse($validate->messages()->first());
        }

        try {
            DB::beginTransaction();

            $user = Auth::user();
            $userWallet = $user->wallet;

            if($request->phone == $user->phone) {
                return ApiResponse::failureResponse('Bạn không thể tự chuyển tiền cho bản thân');
            }

            if($userWallet->balance < $request->cash) {
                return ApiResponse::failureResponse('Vượt quá số dư trong ví');
            }

            $recipient = User::where('phone', $request->phone)->first();
            if(!$recipient) {
                return ApiResponse::failureResponse('Số điện thoại không tồn tại');
            }
            $recipientWallet = $recipient->wallet;
            
            // Update Recipient Wallet Balance
            $recipientOpenBalance = $recipientWallet->balance;
            $recipientWallet->update([
                "balance" => $recipientOpenBalance + $request->cash
            ]);
            $recipientCloseBalance = $recipientWallet->balance;

            // Update User Wallet Balance
            $userOpenBalance = $userWallet->balance;
            $userWallet->update([
                "balance" => $userOpenBalance - $request->cash
            ]);
            $userCloseBalance = $userWallet->balance;

            $transaction = Transaction::create(
                [
                    'from_id' => $user->id,
                    'to_id' => $recipient->id,
                    'amount' => Crypt::encryptString($request->cash),
                    'code' => Helper::generateNumber(),
                    'type' => 'T',
                    'message' => Crypt::encryptString($request->message) ?? null,
                ]
            );

            TransactionDetail::create([
                'transaction_id' => $transaction->id,
                'user_id' => $user->id,
                'open_balance' => $userOpenBalance,
                'close_balance' => $userCloseBalance,
            ]);

            TransactionDetail::create([
                'transaction_id' => $transaction->id,
                'user_id' => $recipient->id,
                'open_balance' => $recipientOpenBalance,
                'close_balance' => $recipientCloseBalance,
            ]);

            if($request->payment_type == 'S') {
                $message = ($request->message != null || $request->message != '') ? $user->f_name . ' đã trả bạn ' . number_format($request->cash) . 'đ với lời nhắn "' . $request->message . '"' : $user->f_name . ' đã trả bạn ' . number_format($request->cash) . 'đ';
                $notification = Notification::create([
                    'user_id' => $recipient->id,
                    'tag' => 'Chia tiền',
                    'tag_model' => 'share_bills',
                    'tag_model_id' => $transaction->id,
                    'title' => $user->f_name . ' vừa trả tiền cho bạn',
                    'body' => $message,
                ]);

                $bill = ShareBill::where('id', $request->share_id)->where('shared_id', Auth::user()->id)->first();
                $bill->payment_type = 'wallet';
                $bill->status = 'paid';
                $bill->message = $message;
                $bill->transaction_id = $transaction->id;
                $bill->save();

                (new SendPushNotification)->userApproveRequest($recipient, $notification->body);
            } else {
                $notification = Notification::create([
                    'user_id' => $recipient->id,
                    'tag' => 'Chuyển tiền',
                    'tag_model' => 'transactions',
                    'tag_model_id' => $transaction->id,
                    'title' => 'Chuyển tiền',
                    'body' => 'Nhận ' . number_format($transaction->amount) . ' từ ' . $user->f_name,
                ]);
                (new SendPushNotification)->userApproveRequest($recipient, $notification->body);
            }

            DB::commit();
            
            return ApiResponse::successResponse($transaction->id);
        } catch(Exception $e) {
            DB::rollBack();
            ApiResponse::failureResponse('Đã có lỗi xảy ra');
        }
    }

    public function history(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'page' => 'integer',
            'limit' => 'integer',
            'filter_key' => 'in:days,months,years',
        ]);

        if ($validate->fails()) {
            return ApiResponse::failureResponse('Đã có lỗi xảy ra');
        }

        $userId = Auth::user()->id;
        $historyGets = Transaction::with('order:id,status', 'fromUser', 'toUser')
            ->where('from_id', $userId)
            ->orWhere('to_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        $limit = $request->limit ?? 10;
        $page = $request->page ?? 1;
        if($request->filter_key == 'days') {
            foreach($historyGets as $item) {
                $date = Carbon::parse($item->created_at)->format('Y-m-d');
                $data[$date]['data'][] = $item;
                $data[$date]['date'] = $date;
            }
            $data = array_values($data);
            $data = $limit ? array_slice($data, $limit*($page-1), $limit) : $data;
        } else if($request->filter_key == 'months') {
            foreach($historyGets as $item) {
                $date = Carbon::parse($item->created_at)->format('Y-m');
                $data[$date]['data'][] = $item;
                $data[$date]['date'] = $date;
            }
            $data = array_values($data);
            $data = $limit ? array_slice($data, $limit*($page-1), $limit) : $data;
        } else if($request->filter_key == 'years') {
            foreach($historyGets as $item) {
                $date = Carbon::parse($item->created_at)->format('Y');
                $data[$date]['data'][] = $item;
                $data[$date]['date'] = $date;
            }
            $data = array_values($data);
            $data = $limit ? array_slice($data, $limit*($page-1), $limit) : $data;
        }
        
        $response = [
            'data' => $data,
            'limit' => $limit,
            'page' => $page,
            'total' => count($data),
        ];
        return ApiResponse::successResponse($response);
    }
}
