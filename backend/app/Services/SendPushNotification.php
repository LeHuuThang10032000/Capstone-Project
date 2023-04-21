<?php

namespace App\Services;

use App\Jobs\SendNotification;
use Exception;

class SendPushNotification
{
    public function merchantNewOrder($merchant, $storeId, $orderId)
    {
        $message = [
            'title' => 'VLPay',
            'type' => 'merchant_new_order',
            'text' => 'Bạn có đơn hàng mới',
            'data' => [
                'store_id' => $storeId,
                'order_id' => $orderId,
            ]
        ];

        SendNotification::dispatch($merchant, $message);
    }

    public function merchantFinishedOrder($user, $storeId, $orderId)
    {
        $message = [
            'title' => 'VLPay',
            'type' => 'merchant_finished_order',
            'text' => 'Đơn hàng của bạn đã được chuẩn bị xong',
            'data' => [
                'store_id' => $storeId,
                'order_id' => $orderId,
            ]
        ];

        SendNotification::dispatch($user, $message);
    }

    public function userApproveRequest($user, $text)
    {
        $message = [
            'title' => 'VLPay',
            'type' => 'user_approve_request',
            'text' => $text,
            'data' => [
                'user_id' => $user->id,
            ]
        ];

        SendNotification::dispatch($user, $message);
    }
}
