<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if(isset($request->key)) {
            $users = User::where('f_name', 'LIKE', '%' . $request->key . '%')->orWhere('phone', 'LIKE', '%' . $request->key . '%')->paginate(10);
            $key = $request->key;
            return view('accounts.index', compact('users', 'key'));
        }
        $users = User::paginate(10);
        return view('accounts.index', compact('users'));
    }

}
