<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Carbon\Carbon;
use Exception;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    //method post
    public function transfer(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'phone' => 'required|phone',
            'cash' => 'required|integer|min:100',
            'message' => 'max:255'
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

            if($userWallet->balance < $request->cash) {
                return ApiResponse::failureResponse('Vượt quá số dư trong ví');
            }

            $recipient = User::where('phone', $request->phone)->first();
            $recipientWallet = $recipient->wallet;
            
            $recipientWallet->update([
                "balance" => $recipientWallet->balance + $request->cash
            ]);
            $userWallet->update([
                "balance" => $userWallet->balance - $request->cash
            ]);

            $transaction = Transaction::create(
                [
                    'from_id' => $user->id,
                    'to_id' => $recipient->id,
                    'amount' => $request->cash,
                    'code' => Helper::generateNumber(),
                ]
            );

            DB::commit();
            return ApiResponse::successResponse($transaction);
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
        $historyGets = Transaction::where('from_id', $userId)
            ->orWhere('to_id', $userId)
            ->orderBy('created_at', 'desc');

        $limit = $request->limit ?? 10;
        $page = $request->page ?? 1;
        if($request->filter_key == 'days') {
            foreach($historyGets->get() as $item) {
                $date = Carbon::parse($item->created_at)->format('Y-m-d');
                $data[$date]['data'][] = $item;
                $data[$date]['date'] = $date;
            }
            $data = array_values($data);
            $data = $limit ? array_slice($data, $limit*($page-1), $limit) : $data;
        } else if($request->filter_key == 'months') {
            foreach($historyGets->get() as $item) {
                $date = Carbon::parse($item->created_at)->format('Y-m');
                $data[$date]['data'][] = $item;
                $data[$date]['date'] = $date;
            }
            $data = array_values($data);
            $data = $limit ? array_slice($data, $limit*($page-1), $limit) : $data;
        } else if($request->filter_key == 'years') {
            foreach($historyGets->get() as $item) {
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
