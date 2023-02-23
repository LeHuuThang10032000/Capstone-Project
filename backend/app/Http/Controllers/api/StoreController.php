<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Models\Store;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class StoreController extends Controller
{
    public function index()
    {
        try {
            $store = Store::where('user_id', '=', Auth::user()->id)
                ->where('status', 'approved')
                ->first();

            return ApiResponse::successResponse($store);
        } catch(Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function update(Request $request)
    {
        try {
            $validate = Validator::make($request->all(), [
                'store_id' => 'required|integer',
                'name' => 'string',
                'phone' => 'phone',
                'email' => 'email',
                'selling_products' => 'string',
                'location' => 'string',
            ], [
                'name.required' => 'Vui lòng nhập tên cửa hàng',
                'phone.required' => 'Vui lòng nhập số điện thoại cửa hàng',
                'phone.phone' => 'Số điện thoại không đúng định dạng',
                'email.email' => 'Vui lòng nhập đúng định dạng email',
                'selling_products.required' => 'Vui lòng nhập sản phẩm kinh doanh của cửa hàng',
                'location.required' => 'Vui lòng nhập vị trí của cửa hàng',
            ]);

            if ($validate->fails()) {
                return APIResponse::FailureResponse($validate->messages()->first());
            }

            $store = Store::where('id', $request->store_id)
                ->where('user_id', '=', Auth::user()->id)
                ->whereNotIn('status', ['denied', 'pending'])
                ->first();

            if($request->name) {
                
                $store->name = $request->name;
            }

            if($request->phone) {
                $store->phone = $request->phone;
            }

            if($request->email) {
                $store->email = $request->email;
            }

            if($request->location) {
                $store->location = $request->location;
            }

            if($request->selling_products) {
                $store->selling_products = $request->selling_products;
            }

            if($request->hasFile('image')) {
                $store->clearMediaCollection('images');
                $store->addMediaFromRequest('image')->toMediaCollection('images');
            }

            if($request->hasFile('cover_photo')) {
                $store->clearMediaCollection('cover_photos');
                $store->addMediaFromRequest('cover_photo')->toMediaCollection('cover_photos');
            }

            $store->save();

            unset($store->media);
            return ApiResponse::successResponse($store);
        } catch(Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }
}
