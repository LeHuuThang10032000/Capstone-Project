<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Models\CreditRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CreditController extends Controller
{
    public function create(Request $request)
    {
        $credit = Validator::make($request->all(), [
            'name' => 'required|max:60',
            'phone' => 'required|phone|digits:10',
            'email' => 'required|email',
            'mssv' => 'required|max:30',
            'amount' => 'required|numeric|between:200000,1000000'
        ], [
            'name.required' => 'Vui lòng nhập họ tên',
            'phone.required' => 'Vui lòng nhập số điện thoại',
            'email.required' => 'Vui lòng nhập email',
            'mssv.required' => 'Vui lòng nhập mssv',
            'amount.required' => 'Vui lòng nhập hạn mức',
            'amount.min' => 'Hạn mức tối thiểu là 200.000đ',
            'amount.max' => 'Hạn mức tối đa là 1.000.000đ',
        ]);

        if ($credit->fails()) {
            return ApiResponse::failureResponse($credit->messages());
        }
        $request['user_id'] = Auth::user()->id;
        $unique = false;
        $transactionId = rand(1000000, 10000000);
        try {
            while (!$unique) {
                $isExisted = DB::table('credit_requests')->where('transaction_id', $transactionId)->first();
                if (!$isExisted) {
                    $unique = true;
                    break;
                }
                $transactionId = rand(1000000, 10000000);
            }
        } catch (ModelNotFoundException $e) {
        }
        $request['transaction_id'] = $transactionId;
        $result = CreditRequest::create($request->all());
        if ($result) {
            return ApiResponse::successResponse($result);
        }
    }
}
