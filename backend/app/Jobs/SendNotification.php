<?php

namespace App\Jobs;

use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    private $user, $message;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($user, $message)
    {
        $this->user = $user;
        $this->message = $message;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            $result = true;
            $type = isset($this->message['type']) ? $this->message['type'] : '';

            $dataArray = [
                "to" => $this->user->device_token ?? '',
                "notification" => [
                    "title" => $this->message['title'],
                    "body" => isset($this->message['text']) ? $this->message['text'] : $this->message,
                    "playSound" => true,
                    "soundName" => "default",
                    "sound" => "default",
                ],
                'data' => [
                    'type' => $type
                ]
            ];
            if (isset($this->message['data'])) $dataArray['data'] = array_merge($dataArray['data'], $this->message['data']);
            $dataEncode = json_encode($dataArray);

            if ($this->user->device_token != "") {
                try {
                    //push notification to device
                    $headerRequest = [
                        'Authorization: key=' . env('FCM_SERVER_KEY'),
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
