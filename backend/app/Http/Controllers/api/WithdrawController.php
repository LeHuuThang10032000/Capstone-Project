<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Models\CreditRequest;
use App\Models\WithdrawRequest;
use Carbon\Carbon;
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
                'transaction_id' => Helper::generateNumber(),
                'user_id' => $user->id,
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
            'filter_key' => 'in:days,months,years',
        ]);

        if ($validate->fails()) {
            return ApiResponse::failureResponse('Đã có lỗi xảy ra');
        }

        try {
            $historyGets = WithdrawRequest::where('user_id', Auth::user()->id)
                ->select('id', 'created_at', 'status', 'amount')
                ->orderBy('created_at', 'desc')
                ->get();

            $limit = $request->limit ?? 10;
            $page = $request->page ?? 1;
            if ($request->filter_key == 'days') {
                foreach ($historyGets as $item) {
                    $date = Carbon::parse($item->created_at)->format('Y-m-d');
                    $data[$date]['data'][] = $item;
                    $data[$date]['date'] = $date;
                }
                $data = array_values($data);
                $data = $limit ? array_slice($data, $limit * ($page - 1), $limit) : $data;
            } else if ($request->filter_key == 'months') {
                foreach ($historyGets as $item) {
                    $date = Carbon::parse($item->created_at)->format('Y-m');
                    $data[$date]['data'][] = $item;
                    $data[$date]['date'] = $date;
                }
                $data = array_values($data);
                $data = $limit ? array_slice($data, $limit * ($page - 1), $limit) : $data;
            } else if ($request->filter_key == 'years') {
                foreach ($historyGets as $item) {
                    $date = Carbon::parse($item->created_at)->format('Y');
                    $data[$date]['data'][] = $item;
                    $data[$date]['date'] = $date;
                }
                $data = array_values($data);
                $data = $limit ? array_slice($data, $limit * ($page - 1), $limit) : $data;
            }

            $response = [
                'data' => $data,
                'limit' => $limit,
                'page' => $page,
                'total' => count($data),
            ];
            return ApiResponse::successResponse($response);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function detail($id)
    {
        $user = Auth::user();
        $data = WithdrawRequest::where('id', $id)
            ->where('user_id', $user->id)
            ->select('id', 'transaction_id', 'amount', 'created_at')
            ->first();

        $data['user_name'] = $user->f_name;
        return ApiResponse::successResponse($data);
    }
}
