<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use function Ramsey\Collection\Map\replace;

class TransactionController extends Controller
{

    //check password during process transaction
    public function checkPwd(Request $request)
    {
        $request->validate([
            "password" => "required"
        ]);
        $user = Auth::user();
        if (Hash::check($user->password, $request->password)) {
            return response([
                "message" => "Mật khẩu xác thực thành công"
            ]);
        }
        return response([
            "message" => "Sai mật khẩu"
        ], 422);
    }

    //method post
    public function transfer(Request $request)
    {
        $request->validate([
            "phone" => "min:10|max:10",
            "f_name" => "min:3",
            "cash" => "numeric|min:3000|max:1000000",
            "message" => "max:255"
        ]);

        if (Auth::check()) {
            $currentUser = Auth::user();
            //sender
            $userWallet = Wallet::where("user_id", $currentUser->id)->first();
            if ($userWallet->balance > $request->cash) {
                $userWallet->update([
                    "balance" => $userWallet->balance - $request->cash
                ]);
                //receiver
                $recipient = User::where('phone', $request->phone)->first();
                //plus and minus each user wallet
                $recipientWallet = Wallet::where("user_id", $recipient->id)->first();
                $recipientWallet->update([
                    "balance" => $recipientWallet->balance + $request->cash
                ]);
                //save transaction infor
                Transaction::create(
                    [
                        "from_id" => $currentUser->id,
                        "to_id" => $recipient->id,
                        "amount" => $request->cash,
                        "message" => $request->message ?? "",
                        "code" => mt_rand(10000000, 99999999)
                    ]
                );

                return response([
                    "from_user" => $currentUser->f_name,
                    "to_user" => $recipient->f_name,
                    "phone" => $request->phone,
                    "wallet" => $userWallet->balance,
                    "message" => $request->message ?? "",
                    "code" => mt_rand(10000000, 99999999)
                ], 200);

            } else {
                return response([
                    "message" => "Số tiền cần chuyển lớn hơn số dư trong ví"
                ], 422);
            }
        }
        return $request->cash;
    }

    public function history(Request $request)
    {
        $userId = Auth::user()->id;
        $historyGets = Transaction::where('from_id', $userId)->orWhere('to_id', $userId)->orderBy('created_at', 'desc')->get();
        $times = [];
        $prevTime = '';
        $index = 0;
        foreach ($historyGets as $key => $item) {
            if($item['from_id'] == $userId) $item['type'] = 'SEND';
            else $item['type'] = 'GET';
            if($key == 0){
                $time = explode(' ', $item['created_at']);
                $time = $time[0].' '.$time[1].' '.$time[2].' '.$time[3];
                $prevTime = $time[$index];
                array_push($times, [$time => [$item]]);
                $times = $times[0];
            }else{
                $time = explode(' ', $item['created_at']);
                $time = $time[0].' '.$time[1].' '.$time[2].' '.$time[3];
                if(strcmp($prevTime, $time) == 0){
                    array_push($times[$time], $item);
                } else {
                    $index++;
                    $prevTime = $time;
                    $times[$prevTime] = [$item];
                }
            }
        }
        return $times;
    }
}
