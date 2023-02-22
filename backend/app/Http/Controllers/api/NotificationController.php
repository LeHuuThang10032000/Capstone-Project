<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        try {
            $data = Notification::where('user_id', Auth::user()->id)->get();
            return ApiResponse::successResponse($data);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        //
    }

    public function show($id)
    {
        try {
            $data = Notification::where('user_id', Auth::user()->id)->where('id', $id)->first();
            return ApiResponse::successResponse($data);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $data = Notification::where('user_id', Auth::user()->id)->where('id', $id)->first();
            $data->read_at = now()->format('Y-m-d H:i:s');
            $data->save();
            return ApiResponse::successResponse($data);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $data = Notification::where('user_id', Auth::user()->id)->where('id', $id)->first();
            $data->delete();
            return ApiResponse::successResponse($data);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }
}
