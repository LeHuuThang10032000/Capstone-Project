<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;

class OrganiserController extends Controller
{
    public function deactivateUser($id)
    {
        $user = User::find($id);

        if($user->status == 'active') {
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
        $stores = Store::all()->groupBy('status');
        return view('store-requests.index', compact('stores'));
    }
}
