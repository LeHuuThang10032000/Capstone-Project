<?php

namespace App\Services;

use App\Http\Response\ApiResponse;
use App\Models\Notification;
use Helper;

class OrderService
{
    public function takenOrder($order, $taken_code)
    {
        if ($order->taken_code !== $taken_code) {
            return APIResponse::failureResponse('Mã nhận hàng không hợp lệ');
        }
        $order->status = 'taken';
        $order->taken_at = now();
        $order->save();

        return ApiResponse::successResponse($order);
    }

    public function cancelOrder($order, $cancelReason)
    {
        if ($order->status != 'pending') return APIResponse::failureResponse('Đã có lỗi xảy ra khi hủy đơn hàng');
        $order->status = 'canceled';
        $order->canceled_at = now();
        $order->cancel_reason = $cancelReason;

        Helper::refund($order);
        $order->save();

        $message = 'Đơn hàng tại ' . $order->store->name . ' của bạn đã bị hủy vì lí do: ' . $order->cancel_reason;
        Notification::create([
            'user_id' => $order->user_id,
            'tag' => 'Hủy đơn',
            'tag_model' => 'orders',
            'tag_model_id' => $order->id,
            'title' => 'Đơn hàng của bạn đã bị hủy',
            'body' => $message,
        ]);
        (new SendPushNotification)->merchantCanceledOrder($order->user, $order->store, $message);
        return ApiResponse::successResponse($order);
    }

    public function acceptOrder($order)
    {
        if ($order->status != 'pending') return APIResponse::failureResponse('Đã có lỗi xảy ra khi tiếp nhận đơn hàng');
        $order->status = 'accepted';
        $order->accepted_at = now();
        $order->save();
        return ApiResponse::successResponse($order);
    }

    public function processingOrder($order)
    {
        if ($order->status != 'accepted') return APIResponse::failureResponse('Đã có lỗi xảy ra khi thực hiện đơn hàng');
        $order->status = 'processing';
        $order->processing_at = now();
        $order->save();
        return ApiResponse::successResponse($order);
    }

    public function finishedOrder($order)
    {
        if ($order->status != 'processing') return APIResponse::failureResponse('Đã có lỗi xảy ra khi hoàn thành đơn hàng');
        $order->status = 'finished';
        $order->finished_at = now();
        $order->save();
        (new SendPushNotification)->merchantFinishedOrder($order->user, $order->store);
        return ApiResponse::successResponse($order);
    }
}
