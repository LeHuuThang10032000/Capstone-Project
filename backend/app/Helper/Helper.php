<?php

use App\Models\Notification;
use App\Models\Order;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;

class Helper {
    public static function generateNumber()
    {
        $number = mt_rand(10000000,99999999);
        if (Transaction::where('code', $number)->count() > 0) self::generateNumber();
        return Crypt::encryptString($number);
    }

    public static function generateOrderCode()
    {
        $number = mt_rand(10000000,99999999);
        if (Order::where('order_code', $number)->count() > 0) self::generateNumber();
        return $number;
    }

    public static function calcPromocodeDiscount($promocode = null, $cartPrice = null)
    {
        $promoDiscount = 0;
        if($promocode) {
            if($promocode->discount_type == 'percentage') {
                $discount = round(($cartPrice * $promocode->discount) / 100);
                return $promoDiscount = ($discount > $promocode->max_discount) ? $promocode->max_discount : $discount;
            } else {
                return $promoDiscount = ($promocode->discount > $cartPrice) ? 0 : $promocode->discount;
            }
        }
        return $promoDiscount;
    }

    public static function refund($order)
    {
        $amount = $order->transactions->first()->amount;
        $merchant = $order->store->user;
        $user = User::where('id', $order->user_id)->first();

        $transaction = Transaction::create([
            'code' => Helper::generateNumber(),
            'amount' => Crypt::encryptString($amount),
            'from_id' => $merchant->id,
            'to_id' => $user->id,
            'order_id' => $order->id,
            'type' => 'R',
            'title' => 'Hoàn tiền đơn hàng ' . $order->order_code,
            'message' => Crypt::encryptString('Hoàn ' . number_format($amount) . 'đ vào ví do đơn hàng ' . $order->order_code . ' đã bị hủy')
        ]);

        // Trừ tiền từ ví của merchant
        $merchantWallet = $merchant->wallet;
        $merchantOpenBalance = $merchantWallet->balance;
        $merchantWallet->balance = $merchantWallet->balance - $amount;
        $merchantCloseBalance = $merchantWallet->balance;
        $merchantWallet->save();

        TransactionDetail::create([
            'transaction_id' => $transaction->id,
            'user_id' => $merchant->id,
            'open_balance' => $merchantOpenBalance,
            'close_balance' => $merchantCloseBalance,
        ]);

        // hoàn tiền vào ví của user
        $userWallet = $user->wallet;
        $userOpenBalance = $userWallet->balance;
        $userWallet->balance = $userWallet->balance + $amount;
        $userCloseBalance = $userWallet->balance;
        $userWallet->save();

        TransactionDetail::create([
            'transaction_id' => $transaction->id,
            'user_id' => $user->id,
            'open_balance' => $userOpenBalance,
            'close_balance' => $userCloseBalance,
        ]);

        Notification::create([
            'user_id' => $user->id,
            'tag' => 'Hoàn tiền',
            'tag_model' => 'transactions',
            'tag_model_id' => $transaction->id,
            'title' => 'Hoàn tiền',
            'body' => 'Bạn được hoàn số tiền ' . number_format($amount) . ' từ đơn hàng ' . $order->order_code . ' do đơn hàng đã bị hủy',
        ]);
    }
}