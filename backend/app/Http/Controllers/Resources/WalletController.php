<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Wallet;
use App\Services\SendPushNotification;
use Carbon\Carbon;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;

class WalletController extends Controller
{
    public function index(Request $request)
    {
        if(isset($request->key)) {
            $wallet = Wallet::whereHas('user', function($query) use ($request) {
                $query->where('phone', $request->key);
            })->paginate(10);
        }
        $wallets = Wallet::paginate(10);
        return view('wallets.index', compact('wallets'));
    }

    public function updateStatus($id)
    {
        $wallet = Wallet::find($id);

        if ($wallet->status == 'active') {
            $wallet->status = 'banned';
            $wallet->save();
        } else {
            $wallet->status = 'active';
            $wallet->save();
        }

        return back()->with('success', 'Thay đổi trạng thái ví thành công');
    }

    public function deposit(Request $request, $id)
    {
        $validate = Validator::make($request->all(), [
            'amount' => 'required|integer|max:10000000',
        ], [
            'amount.required' => 'Vui lòng nhập số tiền cần nạp',
            'amount.integer' => 'Số tiền cần nạp chưa đúng định dạng số',
            'amount.max' => 'Số tiền nạp không được lớn hơn 10.000.000',
        ]);

        if ($validate->fails()) {
            return back()->with('error', $validate->messages()->first());
        }

        $userWallet = Wallet::with('user')->find($id);
        $userOpenBalance = $userWallet->balance;
        $userWallet->balance = $userWallet->balance + $request->amount;
        $userCloseBalance = $userWallet->balance;
        $userWallet->save();

        $hour = Carbon::now()->hour;

        if($userWallet) {
            $transaction = Transaction::create([
                'code' => Helper::generateNumber(),
                'amount' => Crypt::encryptString($request->amount),
                'from_id' => Auth::user()->id,
                'to_id' => $userWallet->user->id,
                'message' => Crypt::encryptString('Nạp ' . $request->amount . ' vào ví'),
                'title' => 'Nạp tiền vào ví'
            ]);

            TransactionDetail::create([
                'transaction_id' => $transaction->id,
                'user_id' => Auth::user()->id,
                'open_balance' => $userOpenBalance,
                'close_balance' => $userCloseBalance,
            ]);
    
            $text = 'Bạn đã nạp thành công số tiền ' . number_format($request->amount) . 'đ vào ví';
            Notification::create([
                'user_id' => Auth::user()->id,
                'tag' => 'Nạp tiền',
                'tag_model' => 'deposits',
                'tag_model_id' => $transaction->id,
                'title' => 'Nạp tiền',
                'body' => $text,
            ]);
        }
        (new SendPushNotification)->userApproveRequest($userWallet->user, $text);

        return back()->with('success', 'Nạp tiền vào ví thành công');
    }
}
