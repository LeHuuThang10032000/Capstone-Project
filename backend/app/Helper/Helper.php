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

    public static function calcPromocodeDiscount($promocode = null, $cartPrice)
    {
        $promoDiscount = 0;
        if($promocode) {
            if($promocode->discount_type == 'percentage') {
                $discount = round(($cartPrice * $promocode->discount) / 100);
                return $promoDiscount = ($discount > $promocode->max_discount) ? $promocode->max_discount : $discount;
            } else {
                return $promoDiscount = $promocode->discount;
            }
        }
        return $promoDiscount;
    }
}