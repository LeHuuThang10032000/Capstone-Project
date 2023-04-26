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
        ];

        SendNotification::dispatch($merchant, $message);
    }

    public function merchantFinishedOrder($user, $store)
    {
        $message = [
            'title' => 'VLPay',
            'type' => 'merchant_finished_order',
            'text' => 'Đơn hàng tại ' . $store->name . ' của bạn đã được chuẩn bị xong.',
        ];

        SendNotification::dispatch($user, $message);
    }

    public function userApproveRequest($user, $text)
    {
        $message = [
            'title' => 'VLPay',
            'type' => 'user_approve_request',
            'text' => $text,
        ];

        SendNotification::dispatch($user, $message);
    }

    public function merchantCanceledOrder($user, $store, $reason)
    {
        $message = [
            'title' => 'VLPay',
            'type' => 'merchant_canceled_request',
            'text' => 'Đơn hàng tại ' . $store->name . ' của bạn đã bị hủy vì lí do: '. $reason,
        ];

        SendNotification::dispatch($user, $message);
    }
}
