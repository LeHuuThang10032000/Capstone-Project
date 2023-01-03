<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $field = $request->validate([
            'full_name' => 'required|string',
            'phone' => 'required|string|min:10|max:10|unique:users,phone',
            'password' => 'required|string|confirmed'
        ]);
        try {
            DB::beginTransaction();
            $user = User::create([
                'f_name' => $field['full_name'],
                'phone' => $field['phone'],
                'password' => bcrypt($field['password'])
            ]);
            $userToken = $user->createToken('myapptoken');
            $response = [
                'user' => $user,
                'token' => $userToken->accessToken,
                'message' => 'Đăng ký thành công'
            ];
            DB::commit();
            return ApiResponse::successResponse($response);
        } catch(Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function logout(Request $request)
    {
        try {
            Auth::user()->tokens()->delete();
            return ApiResponse::successResponse(null);
        } catch(Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function checkPhoneExist(Request $request)
    {
        $user = User::where('phone', $request->phone)->first();

        if($user){
            return response(
                [
                    "message" => "Số điện thoại đã được đăng ký",
                    "status_code" => 422
                ]
                );
        }
        return response(
            [
                "message" => "Số điện thoại chưa được đăng ký",
                "status_code" => 200
            ]
        );
    }

    public function forgotPassword(Request $request){

        $fields = $request->validate([
            'phone' => 'required|string|min:10|max:10',
            'password' => 'required|string|confirmed'
        ]);

        $user = User::where('phone',$fields['phone'])->first();
        $user->password = bcrypt($fields['password']);
        $user->save();
        $token = $user->createToken('myapptoken');

        return ApiResponse::successResponse($token);
    }

    public function login(Request $request){
        $validate = Validator::make($request->all(), [
            'phone' => 'required|phone',
            'password' => 'required|min:6',
        ], [
            'phone.required' => 'Vui lòng nhập số điện thoại',
            'password.required' => 'Vui lòng nhập mật khẩu',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự'
        ]);

        if ($validate->fails()) {
            return ApiResponse::failureResponse($validate->messages()->first());
        }

        $credentials = ['phone' => $request->phone, 'password' => $request->password];
        if (!Auth::attempt($credentials)) {
            return ApiResponse::failureResponse('Số điện thoại hoặc mật khẩu không đúng');
        }

        $user = $request->user();
        $user = $user->refresh();
        $token = $user->createToken('myapptoken')->accessToken;

        return ApiResponse::successResponse($token);
    }
}
