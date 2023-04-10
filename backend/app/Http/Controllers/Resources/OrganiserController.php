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
use Exception;
use Helper;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    public function getStoreRequests()
    {
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

        Notification::create([
            'user_id' => $store->user_id,
            'tag' => 'Cửa hàng',
            'tag_model' => 'stores',
            'tag_model_id' => $request->store_id,
            'title' => 'Yêu cầu mở cửa hàng VLPAY',
            'body' => 'Yêu cầu mở cửa hàng ' . $store->name . ' của bạn đã được chấp nhận',
        ]);
        
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

        Notification::create([
            'user_id' => $store->user_id,
            'tag' => 'Cửa hàng',
            'tag_model' => 'stores',
            'tag_model_id' => $request->store_id,
            'title' => 'Yêu cầu mở cửa hàng VLPAY',
            'body' => 'Yêu cầu mở cửa hàng ' . $store->name . ' của bạn đã bị từ chối',
        ]);

        return back()->with('success', 'Từ chối yêu cầu mở cửa hàng thành công');
    }

    public function getCreditRequests()
    {
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
            'amount.min' => 'Hạn mức thấp nhất là 500000',
            'amount.max' => 'Hạn mức thấp nhất là 10000000'
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

        Notification::create([
            'user_id' => $req->user_id,
            'tag' => 'Hỗ trợ tín dụng',
            'tag_model' => 'credit_requests',
            'tag_model_id' => $req->id,
            'title' => 'Tín dụng sinh viên',
            'body' => 'Tin vui tới. Yêu cầu hỗ trợ tín dụng sinh viên của bạn đã được chấp thuận',
        ]);

        return back()->with('success', 'Chấp nhận yêu cầu cấp hạn mức tín dụng thành công');
    }

    public function denyCredit(Request $request)
    {
        $request->validate([
            'request_id' => 'required|integer',
            'deny_reason' => 'required',
        ]);

        $req = CreditRequest::where('id', $request->request_id)->first();
        if (!$req) {
            return back()->with('error', 'Không tìm thấy yêu cầu');
        }

        $req->status = 'denied';
        $req->deny_reason = $request->deny_reason;
        $req->save();

        Notification::create([
            'user_id' => $req->user_id,
            'tag' => 'Hỗ trợ tín dụng',
            'tag_model' => 'credit_requests',
            'tag_model_id' => $req->id,
            'title' => 'Tín dụng sinh viên',
            'body' => 'Yêu cầu hỗ trợ tín dụng sinh viên của bạn đã bị từ chối',
        ]);

        return back()->with('success', 'Từ chối yêu cầu cấp hạn mức tín dụng thành công');
    }

    public function getWithdrawRequest()
    {
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
    
            $wallet = Wallet::where('user_id', $req->user_id)->first();
            $open_balance = $wallet->balance;
            $wallet->balance = $wallet->balance - $req->amount;
            $close_balance = $wallet->balance;
            $wallet->save();
    
            if($wallet) {
                $transaction = Transaction::create([
                    'code' => $req->transaction_id,
                    'amount' => $req->amount,
                    'from_id' => Auth::user()->id,
                    'to_id' => $wallet->user->id,
                    'message' => 'Rút ' . $req->amount . ' từ ví',
                    'title' => 'Rút tiền'
                ]);
    
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'user_id' => Auth::user()->id,
                    'open_balance' => $open_balance,
                    'close_balance' => $close_balance,
                ]);
            }
    
            Notification::create([
                'user_id' => $req->user_id,
                'tag' => 'Rút tiền',
                'tag_model' => 'withdraw_requests',
                'tag_model_id' => $req->id,
                'title' => 'Rút tiền thành công',
                'body' => 'Bạn đã thành công rút số tiền ' . $req->amount . ' từ ví thành tiền mặt. Mã giao dịch '. $req->transaction_id,
            ]);
    
            DB::commit();
    
            return back()->with('success', 'Chấp nhận yêu cầu rút tiền thành công');
        } catch(Exception $e) {
            DB::commit();
    
            return back()->with('error', $e->getMessage());
        }        
    }

    public function denyWithdraw(Request $request)
    {
        $request->validate([
            'request_id' => 'required|integer',
            'deny_reason' => 'required',
        ]);

        $req = WithdrawRequest::where('id', $request->request_id)->first();
        if (!$req) {
            return back()->with('error', 'Không tìm thấy yêu cầu');
        }
        $req->status = 'denied';
        $req->deny_reason = $request->deny_reason;
        $req->save();

        Notification::create([
            'user_id' => $req->user_id,
            'tag' => 'Rút tiền',
            'tag_model' => 'withdraw_requests',
            'tag_model_id' => $req->id,
            'title' => 'Rút tiền thất bại',
            'body' => 'Lệnh rút tiền ' . $req->transaction_id . ' của bạn đã bị từ chối',
        ]);

        return back()->with('success', 'Từ chối yêu cầu rút tiền thành công');
    }

    public function getListTransactions()
    {
        $transactions = Transaction::paginate(10);
        return view('transactions.index', compact('transactions'));
    }

    public function getStores()
    {
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
            DB::raw('(select count(*) from orders where status = "canceled") as canceled_count'))
            ->get();

        return view('dashboard', compact('pendingStores', 'approvedStores', 'newRegisters', 'monthTransactions', 'orders'));
    }
}
