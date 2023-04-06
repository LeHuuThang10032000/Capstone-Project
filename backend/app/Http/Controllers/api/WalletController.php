<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Models\ShareBill;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    public function showUserWallet()
    {
        $user = Auth::user();
        $wallet = Wallet::where("user_id", $user->id)->first();

        $needToPay = DB::table('share_bills')->select(DB::raw('sum(amount) as total'))
            ->where('shared_id', $user->id)
            ->where('status', 'pending')
            ->where('owner_id', '!=', $user->id)
            ->get();

        $paidPay = DB::table('share_bills')->select(DB::raw('sum(amount) as total'))
            ->where('owner_id', $user->id)
            ->where('status', 'paid')
            ->where('payment_type', 'wallet')
            ->get();

        $wallet['need_pay'] = intval($needToPay->first()->total);
        $wallet['paid_bill'] = intval($paidPay->first()->total);

        return ApiResponse::successResponse($wallet);
    }
}
