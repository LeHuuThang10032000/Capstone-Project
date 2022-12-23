<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;

class UserController extends Controller
{
    use HasApiTokens;
    public function update(Request $request):Response{
        $user = User::find($request->id);

        if($user == null){
             return response(
                "User with id {$request->id} not found",
                Response::HTTP_NOT_FOUND
             );
        }

        if($user->update($request->all()) === false){
            return response(
                "Could not update the user with id {$request->id}",
                Response::HTTP_BAD_REQUEST
            );
        }

        return response($user);
    }

    public function profileUpdate(Request $request){
        $request->validate([
            'full_name'=>'required|min:3'
        ]);
        $user = User::find($request->id);
        $user->full_name = Auth::user();
        $user->full_name = $request['full_name'];
        $user->save();
        return response($user);
    }
}
