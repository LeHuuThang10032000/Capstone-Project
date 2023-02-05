<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Wallet;
use Carbon\Carbon;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class WalletController extends Controller
{
    public function index()
    {
        $wallets = Wallet::simplePaginate(10);
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

        $wallet = Wallet::find($id);

        $wallet->balance = $wallet->balance + $request->amount;
        $wallet->save();

        $hour = Carbon::now()->hour;

        if($wallet) {
            Transaction::create([
                'code' => Helper::generateNumber(),
                'amount' => $request->amount,
                'from_id' => Auth::user()->id,
                'to_id' => $wallet->user->id,
                'message' => 'Nạp ' . $request->amount . ' vào ví',
                'title' => 'Nạp tiền vào ví'
            ]);
        }

        return back()->with('success', 'Nạp tiền vào ví thành công');
    }
}
