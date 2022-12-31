<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

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

        return back();
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
            return back()->with('error', 'Store not found');
        }
        $store->status = 'approved';
        $store->save();

        return back()->with('success', 'Approve store request successfully');
    }

    public function denyStore(Request $request)
    {
        $request->validate([
            'store_id' => 'required|integer',
            'deny_reason' => 'required',
        ]);

        $store = Store::where('id', $request->store_id)->first();
        if (!$store) {
            return back()->with('error', 'Store not found');
        }
        $store->status = 'denied';
        $store->deny_reason = $request->deny_reason;
        $store->save();

        return back()->with('success', 'Deny store request successfully');
    }
}
