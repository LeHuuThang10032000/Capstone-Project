<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ScanQrCodeController extends Controller
{
    
    public function getInfoUser(Request $request){
        $request->validate([
            "id_user" => "required|numeric"
        ]);

        $user = User::where("id", $request->id_user)->first();

        return response([
            "user"=>$user
        ],200);
    }
}
