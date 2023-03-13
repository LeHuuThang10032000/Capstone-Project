<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Models\AddOn;
use App\Models\Cart;
use App\Models\CreditRequest;
use App\Models\Friends;
use App\Models\Notification;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $userCurr = Auth::user()->id;
        $friends = Friends::where('user_id', $userCurr)->get();
        $arrFriends = [];
        foreach($friends as $person){
            array_push($arrFriends, $person['friend_id']);
        }
        array_push($arrFriends, $userCurr);
        $users = User::whereNotIn('id', $arrFriends)->get();
        return ApiResponse::successResponse($users);
    }

    public function update(Request $request): JsonResponse
    {
        $user = User::find($request->id);

        if($user == null){
             return response(
                "User with id {$request->id} not found",
                Response::HTTP_NOT_FOUND
             );
        }

        if($user->update($request->all()) === false){
            return response(
                "Could not update the user with id {$request->id}",
                Response::HTTP_BAD_REQUEST
            );
        }

        return ApiResponse::successResponse($user);
    }

    public function getProfile(): JsonResponse
    {
        if(auth::check()){
            $user = auth()->user();
            auth()->user()->media->all();

            $user['withdraw_request'] = $user->pending_withdraw_request;
            $user['credit_request'] = $user->pending_credit_request;
            return ApiResponse::successResponse($user);
        }
    }

    public function profileUpdate(Request $request): JsonResponse
    {
        $request->validate([
            'full_name'=>'required|min:3',
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        $user = User::find(auth()->user()->id);
        $user->f_name = $request['full_name'];
        if($request->hasFile('image') && $request->file('image')->isValid()){
            if($user->media->all()){
                $file_path = Storage::path($user->media->all()[0]->id);
                $image_path = str_replace('storage/app','public/storage',$file_path);
                \File::deleteDirectory($image_path);
                $user->media()->delete();
            }
            $user->addMediaFromRequest('image')->toMediaCollection('images');
        }
        $user->save();
        return ApiResponse::successResponse($user);
    }

    public function checkUserSendRequestCreateStore(): JsonResponse
    {
        $user = Auth::user()->id;
        $request = Store::where('user_id',$user)->where('status', 'approved')->select('status')->first();
        if($request){
            return ApiResponse::successResponse([
                'status' => 1,
                'request' => $request
            ]);
        }

        return ApiResponse::successResponse([
            'status' => 0
        ]);

    }

    public function createStoreRequest(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'name' => 'required',
            'phone' => 'required|phone',
            'email' => 'email',
            'selling_products' => 'required',
            'location' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ], [
            'name.required' => 'Vui lòng nhập tên cửa hàng',
            'phone.required' => 'Vui lòng nhập số điện thoại cửa hàng',
            'phone.phone' => 'Số điện thoại không đúng định dạng',
            'email.email' => 'Vui lòng nhập đúng định dạng email',
            'selling_products.required' => 'Vui lòng nhập sản phẩm kinh doanh của cửa hàng',
            'location.required' => 'Vui lòng nhập vị trí của cửa hàng',
        ]);

        if ($validate->fails()) {
            return ApiResponse::failureResponse($validate->messages()->first());
        }

        try{
            DB::beginTransaction();

            $store = Store::create([
                'user_id' => Auth::user()->id,
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'selling_products' => $request->selling_products,
                'location' => $request->location,
                'image' => $request->image,
                'status' => 'pending',
                'wallet_balance' => 0,
            ]);

            if($request->hasFile('image') && $request->file('image')->isValid()) {
                $store->addMediaFromRequest('image')->toMediaCollection('images');
            }

            DB::commit();
            return ApiResponse::successResponse(null);
        } catch(\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function findUserById($phone)
    {
        if(Auth::check()){
            $user = User::where("phone", $phone)->first();
            return response([
                'user' => $user
            ],200);
        }
    }

    public function createCreditRequest(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'name' => 'required',
            'phone' => 'required|phone',
            'email' => 'email',
            'reason' => 'required',
            'mssv' => 'required',
        ], [
            'name.required' => 'Vui lòng nhập tên sinh viên',
            'phone.required' => 'Vui lòng nhập số điện thoại',
            'phone.phone' => 'Số điện thoại không đúng định dạng',
            'email.email' => 'Vui lòng nhập đúng định dạng email',
            'reason.required' => 'Vui lòng nhập lý do',
            'mssv.required' => 'Vui lòng nhập mã số sinh viên',
        ]);

        if ($validate->fails())
        {
            return APIResponse::failureResponse($validate->messages()->first());
        }

        try{
            DB::beginTransaction();

            $req = CreditRequest::create([
                'user_id' => Auth::user()->id,
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'reason' => $request->reason,
                'mssv' => $request->mssv,
                'status' => 'pending',
            ]);

            DB::commit();
            return ApiResponse::successResponse(null);
        } catch(\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function getStores(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'limit' => 'integer',
            'page' => 'integer',
        ]);

        if ($validate->fails()) {
            return APIResponse::failureResponse($validate->messages()->first());
        }

        try {
            $stores = Store::whereNotIn('status', ['pending, denied'])
                ->select('id', 'name', 'image', 'phone', 'location')
                ->with('schedules');

            if ($request->page) {
                $limit = $request->limit;
                $page = $request->page;
                $offset = ($page - 1) * $limit;
                $stores = $stores->offset($offset)->limit($limit);
            }

            $stores = $stores->get();
            
            return ApiResponse::successResponse($stores);
        } catch(\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function search(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'key' => 'string'
        ]);

        if ($validate->fails()) {
            return APIResponse::failureResponse($validate->messages()->first());
        }

        try {
            $stores = Store::whereNotIn('status', ['pending', 'denied'])
                ->where('name', 'LIKE', '%' . $request->key . '%')
                ->orWhere('phone', 'LIKE', '%' . $request->key . '%')
                ->with('schedules')
                ->get();

            $users = User::where('status', '!=', 'inactive')
                ->where('f_name', 'LIKE', '%' . $request->key . '%')
                ->orWhere('phone', 'LIKE', '%' . $request->key . '%')
                ->get();

            $data = [
                'stores' => $stores,
                'users' => $users
            ];
            
            return ApiResponse::successResponse($data);
        } catch(\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function getStoreDetail($id): JsonResponse
    {
        try {
            $store = Store::whereNotIn('status', ['pending', 'denied'])
                ->where('id', $id)
                ->with('schedules')
                ->get();

            $productCategories = ProductCategory::where('store_id', $id)
                ->with(['products' => function($query) {
                    $query->select('id','name','price','image','category_id')->where('status', '!=', 'unavailable');
                }])
                ->has('products')
                ->get();

            $store[0]['categories'] = $productCategories;
            
            return ApiResponse::successResponse($store);
        } catch(\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function getProductDetail($id): JsonResponse
    {
        try {
            $product = Product::where('id', $id)->first();
            
            return ApiResponse::successResponse($product);
        } catch(\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function getCart(): JsonResponse
    {
        try {
            $user = Auth::user();
            $carts = $user->carts;
            $result = null;

            if (count($carts)) {
                $haveProductUnavailable = false;
                $products = $carts->map(function ($item, $key) use (&$haveProductUnavailable) {
                    if (($item->product->status ?? '') != 'ACTIVE') $haveProductUnavailable = true;
                    return [
                        'id' => $item->product_id ?? '',
                        'name' => $item->product->name ?? '',
                        'image' => $item->product->image ?? '',
                        'price' => $item->product->price ?? 0,
                        'quantity' => $item->quantity ?? 0,
                        'add_ons' => $item->add_ons ?? [],
                    ];
                });
            }

            $data = [
                'products' => $products,
                'total_quantity' => count($carts)
            ];
            
            return ApiResponse::successResponse($data);
        } catch(\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function deleteCart(): JsonResponse
    {
        try {
            $user = Auth::user();
            $user->carts()->where(function ($query) {
                $query->doesntHave('product')
                    ->orWhereHas('product', function ($q) {
                        $q->where('status', '!=', 'ACTIVE');
                    });
            })->delete();
            
            return ApiResponse::successResponse(null);
        } catch(\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function addToCart(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'store_id' => 'required|exists:'.app(Store::class)->getTable().',id',
            'product_id' => 'required|exists:'.app(Product::class)->getTable().',id',
            'quantity' => 'required|numeric',
            'add_ons' => 'array',
        ], [
            'product_id.exists' => 'Sản phẩm không tồn tại'
        ]);

        if ($validate->fails())
        {
            return APIResponse::FailureResponse($validate->messages()->first());
        }
        $user = Auth::user();
        try {
            DB::beginTransaction();
            
            $addOns = json_encode($request->add_ons);
            $product = DB::table('carts')->where('user_id', $user->id)
                            ->where('product_id', $request->product_id)
                            ->where('add_ons', $addOns)
                            ->where('store_id', $request->store_id)
                            ->first();

            if($product) {
                $quantity = $product->quantity + $request->quantity;

                DB::table('carts')->where('user_id', $user->id)
                    ->where('product_id', $request->product_id)
                    ->where('add_ons', $addOns)
                    ->where('store_id', $request->store_id)
                    ->update(['quantity' => $quantity]);
                
                DB::commit();
                return APIResponse::SuccessResponse(null);
            }

            $newCart = new Cart;
            $newCart->create([
                'user_id' => $user->id,
                'product_id' => $request->product_id,
                'add_ons' => $addOns,
                'quantity' => $request->quantity,
                'store_id' => $request->store_id,
            ]);

            DB::commit();
            return APIResponse::SuccessResponse(null);
        } catch(\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function updateCart(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'product_id' => 'required|exists:'.app(Product::class)->getTable().',id',
            'quantity' => 'required|numeric',
            'add_ons' => 'array',
        ], [
            'product_id.exists' => 'Sản phẩm không tồn tại'
        ]);

        if ($validate->fails())
        {
            return APIResponse::FailureResponse($validate->messages()->first());
        }
        $user = Auth::user();
        try {
            DB::beginTransaction();
            
            $addOns = json_encode($request->add_ons);
            $product = DB::table('carts')->where('user_id', $user->id)
                            ->where('product_id', $request->product_id)
                            ->where('add_ons', $addOns)
                            ->where('store_id', $request->store_id)
                            ->update([
                                'quantity' => $request->quantity
                            ]);

            DB::commit();
            return APIResponse::SuccessResponse(null);
        } catch(\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function createOrder(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'product_id' => 'required|exists:'.app(Product::class)->getTable().',id',
            'quantity' => 'required|numeric',
            'add_ons' => 'array',
        ], [
            'product_id.exists' => 'Sản phẩm không tồn tại'
        ]);

        if ($validate->fails())
        {
            return APIResponse::FailureResponse($validate->messages()->first());
        }
        $user = Auth::user();
        try {
            DB::beginTransaction();
            
            $addOns = json_encode($request->add_ons);
            $product = DB::table('carts')->where('user_id', $user->id)
                            ->where('product_id', $request->product_id)
                            ->where('add_ons', $addOns)
                            ->where('store_id', $request->store_id)
                            ->update([
                                'quantity' => $request->quantity
                            ]);

            DB::commit();
            return APIResponse::SuccessResponse(null);
        } catch(\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }
}
