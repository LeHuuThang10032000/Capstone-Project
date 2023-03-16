<?php

use App\Models\Order;
use App\Models\Transaction;

class Helper {
    public static function generateNumber()
    {
        $number = mt_rand(10000000,99999999);
        if (Transaction::where('code', $number)->count() > 0) self::generateNumber();
        return $number;
    }

    public static function generateOrderCode()
    {
        $number = mt_rand(10000000,99999999);
        if (Order::where('order_code', $number)->count() > 0) self::generateNumber();
        return $number;
    }
}