<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Models\User;
use App\Models\Wallet;
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
            Wallet::create([
                'user_id' => $user->id,
                'balance' => 0,
                'credit_limit' => 0,
                'status' => 'active'
            ]);
            DB::commit();
            return ApiResponse::successResponse($response);
        } catch (Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = Auth::user();
            $user->device_token = null;
            $user->save();
            Auth::user()->tokens()->delete();
            return ApiResponse::successResponse(null);
        } catch (Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function checkPhoneExist(Request $request)
    {
        if ($request->has('own_phone')) {
            if ($request->own_phone == $request->phone) {
                return response(
                    [
                        "message" => "Số điện thoại bị trùng với số điện thoại đang sử dụng",
                        "status_code" => 430,
                    ]
                );
            }
        }

        $user = User::where('phone', $request->phone)->first();

        if ($user) {
            return response(
                [
                    "message" => "Số điện thoại đã được đăng ký",
                    "status_code" => 422,
                    "user" => $user
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

    public function forgotPassword(Request $request)
    {

        $fields = $request->validate([
            'phone' => 'required|string|min:10|max:10',
            'password' => 'required|string|confirmed'
        ]);

        $user = User::where('phone', $fields['phone'])->first();
        $user->password = bcrypt($fields['password']);
        $user->save();
        $token = $user->createToken('myapptoken');

        return ApiResponse::successResponse($token);
    }

    public function login(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'phone' => 'required|phone',
            'password' => 'required|min:6',
            'device_token' => '',
        ], [
            'phone.required' => 'Vui lòng nhập số điện thoại',
            'password.required' => 'Vui lòng nhập mật khẩu',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự'
        ]);

        if ($validate->fails()) {
            return ApiResponse::failureResponse($validate->messages()->first());
        }

        $credentials = ['phone' => $request->phone, 'password' => $request->password];

        $user = User::where('phone', $credentials['phone'])->first();

        if ($user->status === 'inactive') {
            return ApiResponse::failureResponse('Tài khoản của bạn đang bị tạm khóa. Vui lòng liên hệ dịch vụ VLPay tại Văn Lang');
        }

        if ($user->login_attempts >= 3) {
            $user->status = 'inactive';
            $user->save();
            return ApiResponse::failureResponse('Tài khoản của bạn đang bị tạm khóa. Vui lòng liên hệ dịch vụ VLPay tại Văn Lang');
        }

        if ($user && Hash::check($credentials['password'], $user->password)) {
            // Authentication successful
            Auth::login($user);
            $currentToken = $user->tokens();

            if ($currentToken && $user->is_sercurity !== true) {
                // Revoke all tokens except the current one
                $user->tokens()->delete();
            }
            $user->login_attempts = 0; // reset login attempt counter
            $user->device_token = $request->device_token;
            $user->save();

            $token = $user->createToken('myapptoken')->accessToken;

            return ApiResponse::successResponse($token);
        } else {
            // Authentication failed
            if ($user) {
                $user->login_attempts++;
                $user->save();

                $attemptsRemain = 3 - $user->login_attempts;
                return ApiResponse::failureResponse('Sai mật khẩu bạn còn ' . $attemptsRemain . ' lần thử');
            }
            return ApiResponse::failureResponse('Số điện thoại hoặc mật khẩu không đúng');
        }
    }

    public function checkPassword(Request $request)
    {

        $credentials = ['phone' => $request->phone, 'password' => $request->password];
        if (!Auth::attempt($credentials)) {
            return ApiResponse::failureResponse('Số điện thoại hoặc mật khẩu không đúng');
        }

        return response([
            "status" => "success"
        ], 200);
    }
}
