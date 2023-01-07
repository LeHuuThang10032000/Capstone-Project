<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WalletController extends Controller
{
    public function showUserWallet(){
        $CurrentUser = Auth::user();
        $userWallet = Wallet::where("user_id", $CurrentUser->id)->first();
        return response([
            "user_wallet" => $userWallet
        ]);
    }
}
