<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request) {
        $field = $request->validate([
            'full_name' => 'required|string',
            'phone' => 'required|string|min:10|max:10|unique:users,phone',
            'password' => 'required|string|confirmed'
        ]);

        $user = User::create([
            'full_name' => $field['full_name'],
            'phone' => $field['phone'],
            'password' => bcrypt($field['password'])
        ]);

        $response = [
            'user' => $user,
            'status_code' =>201
        ];

        return response($response, 201);
    }

    public function logout(Request $request){
        Auth::user()->tokens()->delete();

        return [
            'status' => 200
        ];
    }

    public function checkPhoneExist(Request $request){
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

    public function login(Request $request){
        $fields = $request->validate([
            'phone' => 'required|string|min:10|max:10',
            'password' => 'required|string'
        ]);

        $user = User::where('phone',$fields['phone'])->first();
        
        if(!$user||!Hash::check($fields['password'],$user->password)){
            return response(
                [
                    'message' => 'Bad request',
                    'status_code' => 401
                ], 401
            );
        }
        $token = $user->createToken('myapptoken')->plainTextToken;
        $response = [
            'user' => $user,
            'status_code' =>201,
            'token'=>$token
        ];

        return response($response, 201);
    }
}
