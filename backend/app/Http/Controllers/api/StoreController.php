<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Models\AddOn;
use App\Models\Product;
use App\Models\ProductCategory;
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

    public function createProduct(Request $request)
    {
//        $validate = Validator::make($request->all(), [
//            'store_id' => 'required|integer',
//            'name' => 'required|max:255',
//            'price' => 'required|integer',
//            'image' => 'required|mimes:jpeg,jpg,png',
//            'category_id' => 'required|integer',
//        ], [
//            'name.required' => 'Vui lòng nhập tên sản phẩm',
//            'name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự',
//            'price.required' => 'Vui lòng giá tiền của sản phẩm',
//            'image.required' => 'Vui lòng chọn hình ảnh cho sản phẩm của bạn',
//            'category_id.required' => 'Vui lòng chọn danh mục sản phẩm của sản phẩm',
//        ]);
//
//        if ($validate->fails()) {
//            return APIResponse::FailureResponse($validate->messages()->first());
//        }

        $store = Store::where('id', $request->store_id)->where('user_id', Auth::user()->id)->get();
        if(!$store) {
            return APIResponse::FailureResponse('Không tìm thấy cửa hàng của bạn. Vui lòng thử lại sau nhé');
        }
        $addOns = json_decode($request->get('add_ons'));

        try {
            DB::beginTransaction();

            $newAddOns = [];
            foreach($addOns as $key => $value) {
                if(!$value->id){
                    $addOnNew = AddOn::create(
                        [
                            'name' => $value->name,
                            'price' => $value->price,
                            'store_id' => $request->store_id,
                        ]
                    );
                    $value->id =  $addOnNew->id;
                    array_push($newAddOns, $addOnNew->id);
                }
                array_push($newAddOns, $value->id);
            }

            $product = new Product;
            $product->store_id = $request->store_id;
            $product->name = $request->name;
            $product->price = $request->price;
            $product->status = 'comingsoon';
            if($request->hasFile('image')) {
                $product->addMediaFromRequest('image')->toMediaCollection('images');
            }
            $product->add_ons = json_encode($newAddOns);
            $product->category_id = $request->category_id;
            $product->save();

            DB::commit();
			return APIResponse::SuccessResponse(null);
        } catch(Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function createProductCategory(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'store_id' => 'required|integer',
            'name' => 'required|max:255',
        ], [
            'name.required' => 'Vui lòng nhập tên sản phẩm',
            'name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        $store = Store::where('id', $request->store_id)->where('user_id', Auth::user()->id)->get();
        if(!$store) {
            return APIResponse::FailureResponse('Không tìm thấy cửa hàng của bạn. Vui lòng thử lại sau nhé');
        }

        try {
            DB::beginTransaction();
            $category = new ProductCategory;
            $category->name = $request->name;
            $category->store_id = $request->store_id;
            $category->save();

            DB::commit();
			return APIResponse::SuccessResponse(null);
        } catch(Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function updateProductCategory(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'store_id' => 'required|integer',
            'name' => 'required|max:255',
            'category_id' => 'required|integer'
        ], [
            'name.required' => 'Vui lòng nhập tên sản phẩm',
            'name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        $store = Store::where('id', $request->store_id)->where('user_id', Auth::user()->id)->get();
        if(!$store) {
            return APIResponse::FailureResponse('Không tìm thấy cửa hàng của bạn. Vui lòng thử lại sau nhé');
        }

        try {
            DB::beginTransaction();
            $category = ProductCategory::where('id', $request->category_id)->first();
            $category->name = $request->name;
            $category->save();

            DB::commit();
			return APIResponse::SuccessResponse(null);
        } catch(Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function updateProduct(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'store_id' => 'required|integer',
            'name' => 'required|max:255',
            'product_id' => 'required|integer',
        ], [
            'name.required' => 'Vui lòng nhập tên sản phẩm',
            'name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        $store = Store::where('id', $request->store_id)->where('user_id', Auth::user()->id)->get();
        if(!$store) {
            return APIResponse::FailureResponse('Không tìm thấy cửa hàng của bạn. Vui lòng thử lại sau nhé');
        }
        $addOns = json_decode($request->get('add_ons'));

        try {
            DB::beginTransaction();

            $newAddOns = [];
            foreach($addOns as $key => $value) {
                if(!$value->id){
                    $addOnNew = AddOn::create(
                        [
                            'name' => $value->name,
                            'price' => $value->price,
                            'store_id' => $request->store_id,
                        ]
                    );
                    $value->id =  $addOnNew->id;
                    array_push($newAddOns, $addOnNew->id);
                }
                array_push($newAddOns, $value->id);
            }

            $product = Product::where('id', $request->product_id)->update([
                'name' => $request->name,
                'price' => $request->price,
                'status' => 'comingsoon',
                'add_ons' => json_encode($newAddOns),
                'category_id' => $request->category_id,
            ]);

            if($request->hasFile('image')) {
                $product->clearMediaCollection('images');
                $product->addMediaFromRequest('image')->toMediaCollection('images');
            }

            DB::commit();
			return APIResponse::SuccessResponse(null);
        } catch(Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function getStoreMenu(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'store_id' => 'required',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $categories = ProductCategory::where('store_id', $request->store_id)
                ->select('id', 'name')
                ->with('products:id,name,price,category_id')
                ->withCount('products')
                ->get();

			return APIResponse::SuccessResponse($categories);
        } catch(Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function getAddOn(Request $request)
    {
        try{
            $validate = Validator::make($request->all(), [
                'store_id' => 'required',
            ]);

            if ($validate->fails()) {
                return APIResponse::FailureResponse($validate->messages()->first());
            }

            $addOns = AddOn::select('id', 'name', 'price')->where('store_id', $request->store_id)->get();

            return APIResponse::SuccessResponse($addOns);
        } catch(Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }
}
