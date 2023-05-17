<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\CreditRequest;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Promocode;
use App\Models\Store;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WithdrawRequest;
use App\Services\SendPushNotification;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrganiserController extends Controller
{
    public function deactivateUser($id)
    {
        $user = User::find($id);

        if ($user->status == 'active') {
            $user->status = 'inactive';
            $user->save();
        } else {
            $user->status = 'active';
            $user->save();
        }

        return back()->with('success', 'Chấp nhận yêu cầu mở cửa hàng thành công');
    }

    public function getStoreRequests(Request $request)
    {
        if(isset($request->key)) {
            $key = $request->key;

            $pending = Store::where(function ($query) use ($request) {
                    $query->where('name', 'LIKE', '%' . $request->key . '%')
                        ->orWhere('phone', 'LIKE', '%' . $request->key . '%');
                })
                ->where('status', 'pending')
                ->paginate(5);
            $pending->appends (array ('key' => $key));

            $approved = Store::where(function ($query) use ($request) {
                    $query->where('name', 'LIKE', '%' . $request->key . '%')
                        ->orWhere('phone', 'LIKE', '%' . $request->key . '%');
                })
                ->where('status', 'approved')
                ->paginate(5);
            $approved->appends (array ('key' => $key));

            $denied = Store::where(function ($query) use ($request) {
                    $query->where('name', 'LIKE', '%' . $request->key . '%')
                        ->orWhere('phone', 'LIKE', '%' . $request->key . '%');
                })
                ->where('status', 'denied')
                ->paginate(5);
            $denied->appends (array ('key' => $key));

            $stores = [
                'pending' => $pending ?? [],
                'approved' => $approved ?? [],
                'denied' => $denied ?? [],
            ];
            return view('store-requests.index', compact('stores', 'key'));
        }
        $pending = Store::where('status', 'pending')->paginate(5);
        $approved = Store::where('status', 'approved')->paginate(5);
        $denied = Store::where('status', 'denied')->paginate(5);

        $stores = [
            'pending' => $pending ?? [],
            'approved' => $approved ?? [],
            'denied' => $denied ?? [],
        ];
        return view('store-requests.index', compact('stores'));
    }

    public function approveStore(Request $request)
    {
        $request->validate([
            'store_id' => 'required|integer'
        ]);

        $store = Store::where('id', $request->store_id)->first();
        if (!$store) {
            return back()->with('error', 'Không tìm thấy cửa hàng');
        }
        $store->status = 'approved';
        $store->save();

        $user = User::find($store->user_id);
        $text = 'Yêu cầu mở cửa hàng ' . $store->name . ' của bạn đã được chấp nhận';
        Notification::create([
            'user_id' => $store->user_id,
            'tag' => 'Cửa hàng',
            'tag_model' => 'stores',
            'tag_model_id' => $request->store_id,
            'title' => 'Yêu cầu mở cửa hàng VLPAY',
            'body' => 'Yêu cầu mở cửa hàng ' . $store->name . ' của bạn đã được chấp nhận',
        ]);

        (new SendPushNotification)->userApproveRequest($user, $text);
        
        return back()->with('success', 'Chấp nhận yêu cầu mở cửa hàng thành công');
    }

    public function denyStore(Request $request)
    {
        $request->validate([
            'store_id' => 'required|integer',
            'deny_reason' => 'required',
        ]);

        $store = Store::where('id', $request->store_id)->first();
        if (!$store) {
            return back()->with('error', 'Không tìm thấy cửa hàng');
        }
        $store->status = 'denied';
        $store->deny_reason = $request->deny_reason;
        $store->save();

        $user = User::find($store->user_id);
        $text = 'Yêu cầu mở cửa hàng ' . $store->name . ' của bạn đã bị từ chối';
        Notification::create([
            'user_id' => $store->user_id,
            'tag' => 'Cửa hàng',
            'tag_model' => 'stores',
            'tag_model_id' => $request->store_id,
            'title' => 'Yêu cầu mở cửa hàng VLPAY',
            'body' => $text,
        ]);

        (new SendPushNotification)->userApproveRequest($user, $text);

        return back()->with('success', 'Từ chối yêu cầu mở cửa hàng thành công');
    }

    public function getCreditRequests(Request $request)
    {
        if(isset($request->key)) {
            $key = $request->key;
            $pending = CreditRequest::with('user')->where(function($query) use ($request) {
                    $query->where('credit_requests.name', 'LIKE', '%' . $request->key . '%')
                        ->where('credit_requests.status', 'pending');
                })
                ->orWhere(function($query) use ($key) {
                    $query->whereHas('user', function($query) use ($key) {
                            $query->where('phone', 'LIKE', '%' . $key . '%');
                        })
                        ->where('credit_requests.status', 'pending');
                })
                ->paginate(5);

            $approved = CreditRequest::with('user')->where(function($query) use ($request) {
                    $query->where('credit_requests.name', 'LIKE', '%' . $request->key . '%')
                        ->where('credit_requests.status', 'pending');
                })
                ->orWhere(function($query) use ($key) {
                    $query->whereHas('user', function($query) use ($key) {
                            $query->where('phone', 'LIKE', '%' . $key . '%');
                        })
                        ->where('credit_requests.status', 'approved');
                })
                ->paginate(5);

            $denied = CreditRequest::with('user')->where(function($query) use ($request) {
                    $query->where('credit_requests.name', 'LIKE', '%' . $request->key . '%')
                        ->where('credit_requests.status', 'pending');
                })
                ->orWhere(function($query) use ($key) {
                    $query->whereHas('user', function($query) use ($key) {
                            $query->where('phone', 'LIKE', '%' . $key . '%');
                        })
                        ->where('credit_requests.status', 'denied');
                })
                ->paginate(5);

            $requests = [
                'pending' => $pending ?? [],
                'approved' => $approved ?? [],
                'denied' => $denied ?? [],
            ];
            return view('credit-requests.index', compact('requests', 'key'));
        }

        $pending = CreditRequest::where('status', 'pending')->paginate(5);
        $approved = CreditRequest::where('status', 'approved')->paginate(5);
        $denied = CreditRequest::where('status', 'denied')->paginate(5);

        $requests = [
            'pending' => $pending ?? [],
            'approved' => $approved ?? [],
            'denied' => $denied ?? [],
        ];
        return view('credit-requests.index', compact('requests'));
    }

    public function approveCredit(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'request_id' => 'required|integer',
            'amount' => 'required|integer|min:500000|max:10000000',
        ], [
            'amount.required' => 'Vui lòng nhập hạn mức tín dụng',
            'amount.integer' => 'Hạn mức tín dụng chưa đúng định dạng số',
            'amount.min' => 'Hạn mức thấp nhất là ' . number_format(500000) . 'đ',
            'amount.max' => 'Hạn mức cao nhất là ' . number_format(10000000) . 'đ'
        ]);

        if ($validate->fails()) {
            return back()->with('error', $validate->messages()->first());
        }

        $req = CreditRequest::where('id', $request->request_id)->first();
        if (!$req) {
            return back()->with('error', 'Không tìm thấy yêu cầu');
        }
        $req->status = 'approved';
        $req->amount = $request->amount;
        $req->save();

        $wallet = Wallet::where('user_id', $req->user_id)->first();
        $wallet->credit_limit = $req->amount;
        $wallet->save();

        $user = User::find($req->user_id);
        $text = 'Tin vui tới. Yêu cầu hỗ trợ tín dụng sinh viên của bạn đã được chấp thuận';
        Notification::create([
            'user_id' => $req->user_id,
            'tag' => 'Hỗ trợ tín dụng',
            'tag_model' => 'credit_requests',
            'tag_model_id' => $req->id,
            'title' => 'Tín dụng sinh viên',
            'body' => $text,
        ]);

        (new SendPushNotification)->userApproveRequest($user, $text);

        return back()->with('success', 'Chấp nhận yêu cầu cấp hạn mức tín dụng thành công');
    }

    public function denyCredit(Request $request)
    {
        $request->validate([
            'request_id' => 'required|integer',
            'deny_reason' => 'required|max:255',
        ],[
            'deny_reason.max' => 'Lí do từ chối không quá 255 kí tự'
        ]);

        $req = CreditRequest::where('id', $request->request_id)->first();
        if (!$req) {
            return back()->with('error', 'Không tìm thấy yêu cầu');
        }

        $req->status = 'denied';
        $req->deny_reason = $request->deny_reason;
        $req->save();

        $user = User::find($req->user_id);
        $text = 'Yêu cầu hỗ trợ tín dụng sinh viên của bạn đã bị từ chối';
        Notification::create([
            'user_id' => $req->user_id,
            'tag' => 'Hỗ trợ tín dụng',
            'tag_model' => 'credit_requests',
            'tag_model_id' => $req->id,
            'title' => 'Tín dụng sinh viên',
            'body' => $text,
        ]);

        (new SendPushNotification)->userApproveRequest($user, $text);

        return back()->with('success', 'Từ chối yêu cầu cấp hạn mức tín dụng thành công');
    }

    public function getWithdrawRequest(Request $request)
    {
        if(isset($request->key)) {
            $key = $request->key;
            $pending = WithdrawRequest::with('user')->where(function($query) use ($request) {
                    $query->where('withdraw_request.transaction_id', 'LIKE', '%' . $request->key . '%')
                        ->where('withdraw_request.status', 'pending');
                })
                ->orWhere(function($query) use ($key) {
                    $query->whereHas('user', function($query) use ($key) {
                            $query->where('phone', 'LIKE', '%' . $key . '%');
                        })
                        ->where('withdraw_request.status', 'pending');
                })
                ->paginate(5);
            $pending->appends (array ('key' => $key));

            $approved = WithdrawRequest::with('user')->where(function($query) use ($request) {
                    $query->where('withdraw_request.transaction_id', 'LIKE', '%' . $request->key . '%')
                        ->where('withdraw_request.status', 'approved');
                })
                ->orWhere(function($query) use ($key) {
                    $query->whereHas('user', function($query) use ($key) {
                            $query->where('phone', 'LIKE', '%' . $key . '%');
                        })
                        ->where('withdraw_request.status', 'approved');
                })
                ->paginate(5);
            $approved->appends (array ('key' => $key));

            $denied = WithdrawRequest::with('user')->where(function($query) use ($request) {
                    $query->where('withdraw_request.transaction_id', 'LIKE', '%' . $request->key . '%')
                        ->where('withdraw_request.status', 'denied');
                })
                ->orWhere(function($query) use ($key) {
                    $query->whereHas('user', function($query) use ($key) {
                            $query->where('phone', 'LIKE', '%' . $key . '%');
                        })
                        ->where('withdraw_request.status', 'denied');
                })
                ->paginate(5);
            $denied->appends (array ('key' => $key));

            $requests = [
                'pending' => $pending ?? [],
                'approved' => $approved ?? [],
                'denied' => $denied ?? [],
            ];
            return view('withdraw-request.index', compact('requests', 'key'));
        }
        $pending = WithdrawRequest::where('status', 'pending')->with('user.wallet')->paginate(5);
        $approved = WithdrawRequest::where('status', 'approved')->with('user.wallet')->paginate(5);
        $denied = WithdrawRequest::where('status', 'denied')->with('user.wallet')->paginate(5);

        $requests = [
            'pending' => $pending ?? [],
            'approved' => $approved ?? [],
            'denied' => $denied ?? [],
        ];
        return view('withdraw-request.index',compact('requests'));
    }

    public function approveWithdraw(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'request_id' => 'required|integer',
        ]);

        if ($validate->fails()) {
            return back()->with('error', $validate->messages()->first());
        }

        try {
            DB::beginTransaction();

            $req = WithdrawRequest::where('id', $request->request_id)->first();
            if (!$req) {
                return back()->with('error', 'Không tìm thấy yêu cầu');
            }
            $req->status = 'approved';
            $req->save();
    
            $wallet = Wallet::with('user')->where('user_id', $req->user_id)->first();
            $open_balance = $wallet->balance;
            $wallet->balance = $wallet->balance - $req->amount;
            $close_balance = $wallet->balance;
            $wallet->save();
    
            if($wallet) {
                $transaction = Transaction::create([
                    'code' => Crypt::encryptString($req->transaction_id),
                    'amount' => Crypt::encryptString($req->amount),
                    'from_id' => Auth::user()->id,
                    'to_id' => $wallet->user->id,
                    'message' => Crypt::encryptString('Rút ' . $req->amount . ' từ ví'),
                    'title' => 'Rút tiền'
                ]);
    
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'user_id' => Auth::user()->id,
                    'open_balance' => $open_balance,
                    'close_balance' => $close_balance,
                ]);
            }
    
            $text = 'Bạn đã thành công rút số tiền ' . number_format($req->amount) . 'đ từ ví thành tiền mặt. Mã giao dịch '. $req->transaction_id;
            Notification::create([
                'user_id' => $req->user_id,
                'tag' => 'Rút tiền',
                'tag_model' => 'withdraw_requests',
                'tag_model_id' => $req->id,
                'title' => 'Rút tiền thành công',
                'body' => $text,
            ]);
    
            (new SendPushNotification)->userApproveRequest($wallet->user, $text);
            DB::commit();
            return back()->with('success', 'Chấp nhận yêu cầu rút tiền thành công');
        } catch(Exception $e) {
            DB::rollback();
            return back()->with('error', $e->getMessage());
        }        
    }

    public function denyWithdraw(Request $request)
    {
        $request->validate([
            'request_id' => 'required|integer',
            'deny_reason' => 'required|max:255',
        ],[
            'deny_reason.max' => 'Lí do từ chối không quá 255 kí tự'
        ]);

        $req = WithdrawRequest::where('id', $request->request_id)->first();
        if (!$req) {
            return back()->with('error', 'Không tìm thấy yêu cầu');
        }
        $req->status = 'denied';
        $req->deny_reason = $request->deny_reason;
        $req->save();

        $user = User::find($req->user_id);
        $text = 'Lệnh rút tiền của bạn đã bị từ chối';

        Notification::create([
            'user_id' => $req->user_id,
            'tag' => 'Rút tiền',
            'tag_model' => 'withdraw_requests',
            'tag_model_id' => $req->id,
            'title' => 'Rút tiền thất bại',
            'body' => $text,
        ]);

        (new SendPushNotification)->userApproveRequest($user, $text);

        return back()->with('success', 'Từ chối yêu cầu rút tiền thành công');
    }

    public function getListTransactions(Request $request)
    {
        if(isset($request->key)) {
            $transactions = Transaction::where('code', 'LIKE', '%' . $request->key . '%')
                ->get();
            $key = $request->key;
            return view('transactions.index', compact('transactions', 'key'));
        }
        $transactions = Transaction::paginate(10);
        return view('transactions.index', compact('transactions'));
    }

    public function getStores(Request $request)
    {
        if(isset($request->key)) {
            $key = $request->key;
            $stores = Store::where('name', 'LIKE', '%' . $key . '%')
                ->where('status', 'approved')
                ->withCount('orders')
                ->orWhere('phone', 'LIKE', '%' . $key . '%')
                ->with('user')
                ->paginate(10);
            return view('stores.index', compact('stores', 'key'));
        }
        $stores = Store::with('user')->where('status', 'approved')->withCount('orders')->paginate(10);
        return view('stores.index', compact('stores'));
    }

    public function dashboard()
    {
        $pendingStores = Store::where('status', 'pending')->count();
        $approvedStores = Store::where('status', 'approved')->count();
        $newRegisters = User::whereMonth('created_at', now()->month)->count();
        $monthTransactions = Transaction::whereMonth('created_at', now()->month)->count();
        $orders = Order::select(
            '*', 
            DB::raw('(select count(*) from orders where status = "taken") as taken_count'),
            DB::raw('(select count(*) from orders where status = "canceled") as canceled_count'),
            DB::raw('(select sum(order_total - discount_amount) from orders where status = "taken") as total'))
            ->get();
        $transactions = Transaction::select(
            '*',
            DB::raw('(select sum(amount) from transactions where type = "T") as transaction_total'),
            DB::raw('(select sum(amount) from transactions where type = "W") as withdraw_total'),
            DB::raw('(select sum(amount) from transactions where type = "D") as deposit_total'),
            DB::raw('(select sum(amount) from credit_requests where status = "approved") as credit_total'),
            DB::raw('(select sum(balance) from user_wallets) as wallet_total'),
            DB::raw('(select count(*) from users) as user_total'))
            ->with('fromUser', 'toUser')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $admin = User::where('is_organiser', 1)->first();

        return view('dashboard', compact('pendingStores', 'approvedStores', 'newRegisters', 'monthTransactions', 'orders', 'transactions', 'admin'));
    }

    public function parking()
    {
        $fee = DB::table('settings')->pluck('value', 'key');
        $users = User::select('id', 'phone', 'is_sercurity', 'f_name')->get();
        return view('parking.index', compact('fee', 'users'));
    }

    public function updateFee(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'parking_fee' => 'required|integer|min:0',
        ], [
            'parking_fee.min' => 'Phí gửi xe không nhỏ hơn 0đ',
            'parking_fee.required' => 'Phí gửi xe không được bỏ trống',
            'parking_fee.integer' => 'Phí gửi xe không đúng định dạng'
        ]);

        if ($validate->fails()) {
            return response()->json(['message' => $validate->messages()->first(), 'img' => asset('img/error.png')]);
        }

        try {
            DB::table('settings')->updateOrInsert(['key' => 'parking_fee'], [
                'value' => $request->parking_fee
            ]);
            return response()->json(['message' => 'Cập nhật phí gửi xe thành công', 'img' => asset('img/success.png')]);
        } catch(Exception $e) {
            return response()->json(['message' => 'Cập nhật phí gửi không xe thành công. Đã có lỗi xảy ra', 'img' => asset('img/error.png')]);
        }
    }
}
