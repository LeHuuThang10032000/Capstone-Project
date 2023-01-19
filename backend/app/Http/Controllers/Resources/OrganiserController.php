<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\CreditRequest;
use App\Models\Store;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
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

        $data = Store::all()->groupBy('status');

        $stores = [
            'pending' => $data['pending'] ?? [],
            'approved' => $data['approved'] ?? [],
            'denied' => $data['denied'] ?? [],
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

        return back()->with('success', 'Từ chối yêu cầu mở cửa hàng thành công');
    }

    public function getCreditRequests()
    {

        $data = CreditRequest::all()->groupBy('status');


        $requests = [
            'pending' => $data['pending'] ?? [],
            'approved' => $data['approved'] ?? [],
            'denied' => $data['denied'] ?? [],
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

        return back()->with('success', 'Từ chối yêu cầu cấp hạn mức tín dụng thành công');
    }
}
