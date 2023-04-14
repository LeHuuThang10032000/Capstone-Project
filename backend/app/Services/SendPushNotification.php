<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Exception;

class SendPushNotification
{
    public function merchantNewOrder($merchant, $storeId, $requestId)
    {
        $messageData = [
            'type' => 'merchant_new_order',
            'text' => 'Bạn có đơn hàng mới',
            'data' => [
                'store_id' => $storeId,
                'request_id' => $requestId,
            ]
        ];

        return $this->sendNotification($merchant, $messageData);
    }

    public function merchantFinishedOrder($merchant, $storeId, $requestId)
    {
        $messageData = [
            'type' => 'merchant_finished_order',
            'text' => 'Đơn hàng của bạn đã được chuẩn bị xong',
            'data' => [
                'store_id' => $storeId,
                'request_id' => $requestId,
            ]
        ];

        return $this->sendNotification($merchant, $messageData);
    }

    public function sendNotification($user, $message)
    {
        $SERVER_API_KEY = env('FCM_SERVER_KEY');

        try {
            $result = true;
            $type = isset($message['type']) ? $message['type'] : '';

            $dataArray = [
                "to" => $user->device_token ?? '',
                "notification" => [
                    "body" => isset($message['text']) ? $message['text'] : $message,
                    "playSound" => true,
                    "soundName" => "default",
                    "sound" => "default",
                ],
                'data' => [
                    'type' => $type
                ]
            ];
            if (isset($message['data'])) $dataArray['data'] = array_merge($dataArray['data'], $message['data']);
            $dataEncode = json_encode($dataArray);

            if ($user->device_token != "") {
                try {
                    //push notification to device
                    $headerRequest = [
                        'Authorization: key=' . $SERVER_API_KEY,
                        'Content-Type: application/json'
                    ];

                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_HTTPHEADER, $headerRequest);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
                    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $dataEncode);
                    $output = curl_exec($ch);
                    logger($output);
                    if ($output === FALSE) {
                        logger(curl_error($ch));
                    }
                    curl_close($ch);
                } catch (Exception $e) {
                    logger($e->getMessage());
                    $result = false;
                }
            }

            return $result;
        } catch (Exception $e) {
            return $e;
        }
    }
}
