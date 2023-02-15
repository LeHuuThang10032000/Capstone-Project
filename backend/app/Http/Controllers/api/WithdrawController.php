<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Models\CreditRequest;
use App\Models\WithdrawRequest;
use Helper;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class WithdrawController extends Controller
{
    public function create(Request $request)
    {
        $user = Auth::user();
        $validate = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1000|max:' . $user->wallet->balance
        ], [
            'amount.required' => 'Nhập số tiền cần rút',
            'amount.min' => 'Số tiền rút tối thiểu là 1.000đ',
            'amount.max' => 'Số tiền trong ví không đủ',
        ]);

        if ($validate->fails()) {
            return ApiResponse::failureResponse($validate->messages()->first());
        }
        
        try {
            $result = WithdrawRequest::create([
                'user_name' => $user->f_name,
                'transaction_id' => Helper::generateNumber(),
                'status' => 'pending',
                'amount' => $request->amount,
                'created_at' => now(),
            ]);
            return ApiResponse::successResponse($result);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function histories(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'page' => 'integer',
            'limit' => 'integer',
        ]);

        if ($validate->fails()) {
            return ApiResponse::failureResponse('Đã có lỗi xảy ra');
        }

        try {
            $data = WithdrawRequest::where('user_id', Auth::user()->id)
                ->select('id', 'created_at');

            if($request->page) {
                $limit = $request->limit;
                $page = $request->page;
                $offset = ($page-1) * $limit;
                $data = $data->offset($offset)->limit($limit);
            }

            $data = $data->get();

            return ApiResponse::successResponse($data);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function detail($id)
    {

    }
}
