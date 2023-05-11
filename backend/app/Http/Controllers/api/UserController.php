<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Models\Cart;
use App\Models\CreditRequest;
use App\Models\Friends;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Promocode;
use App\Models\ShareBill;
use App\Models\Store;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\User;
use App\Services\SendPushNotification;
use Helper;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
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
        foreach ($friends as $person) {
            array_push($arrFriends, $person['friend_id']);
        }
        array_push($arrFriends, $userCurr);
        $users = User::whereNotIn('id', $arrFriends)->get();
        return ApiResponse::successResponse($users);
    }

    public function update(Request $request): JsonResponse
    {
        $user = User::find($request->id);

        if ($user == null) {
            return response(
                "User with id {$request->id} not found",
                Response::HTTP_NOT_FOUND
            );
        }

        if ($user->update($request->all()) === false) {
            return response(
                "Could not update the user with id {$request->id}",
                Response::HTTP_BAD_REQUEST
            );
        }

        return ApiResponse::successResponse($user);
    }

    public function getProfile(): JsonResponse
    {
        if (auth::check()) {
            $user = auth()->user();

            $user['withdraw_request'] = $user->pending_withdraw_request;
            $user['credit_request'] = $user->pending_credit_request;
            return ApiResponse::successResponse($user);
        }
    }

    public function profileUpdate(Request $request): JsonResponse
    {
        $request->validate([
            'full_name' => 'required|min:3',
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        $user = User::find(auth()->user()->id);
        $user->f_name = $request['full_name'];
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            if ($user->media->all()) {
                $file_path = Storage::path($user->media->all()[0]->id);
                $image_path = str_replace('storage/app', 'public/storage', $file_path);
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
        $store = Store::where('user_id', $user)->select('id', 'status')->first();
        return ApiResponse::successResponse([
            'status' => $store->status ?? null,
            'store_id' => $store->id ?? null,
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

        try {
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

            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $store->addMediaFromRequest('image')->toMediaCollection('images');
            }

            DB::commit();
            return ApiResponse::successResponse(null);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function findUserById($phone)
    {
        if (Auth::check()) {
            $user = User::where("phone", $phone)->first();
            return response([
                'user' => $user
            ], 200);
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

        if ($validate->fails()) {
            return APIResponse::failureResponse($validate->messages()->first());
        }

        try {
            DB::beginTransaction();

            $req = CreditRequest::updateOrCreate(
                [
                    'user_id' => Auth::user()->id,
                ],
                [
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'email' => $request->email,
                    'reason' => $request->reason,
                    'mssv' => $request->mssv,
                    'status' => 'pending',
                ]
            );

            DB::commit();
            return ApiResponse::successResponse(null);
        } catch (\Exception $e) {
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
            $stores = Store::whereNotIn('status', ['pending', 'denied'])
                // ->where('user_id', '!=', Auth::user()->id)
                ->select('id', 'name', 'image', 'phone', 'location', 'status');

            if ($request->page) {
                $limit = $request->limit;
                $page = $request->page;
                $offset = ($page - 1) * $limit;
                $stores = $stores->offset($offset)->limit($limit);
            }

            $stores = $stores->get();

            foreach($stores as $store) {
                $used = DB::table('promocode_used')->where('user_id', Auth::user()->id)->pluck('promocode_id')->toArray();

                $promocodes = DB::table('promocodes')
                    ->selectRaw('(CASE 
                        WHEN `limit` = 0 THEN 1 
                        WHEN `limit` != 0 AND total_used < `limit` THEN 1
                        ELSE 0 
                        END) AS available')
                    ->where('store_id', $store->id)
                    ->whereNotIn('id', $used)
                    ->where('start_date', '<=', now())
                    ->where('end_date', '>=', now())
                    ->whereTime('start_time', '<=', now())
                    ->whereTime('end_time', '>=', now())
                    ->having('available', 1)
                    ->count();

                $store['promocodes'] = $promocodes;
            }

            return ApiResponse::successResponse($stores);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function search(Request $request): JsonResponse
    {
        $cur_user = Auth::user()->id;
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

            foreach($stores as $store) {
                $used = DB::table('promocode_used')->where('user_id', Auth::user()->id)->pluck('promocode_id')->toArray();

                $promocodes = DB::table('promocodes')
                    ->where('store_id', $store->id)
                    ->whereNotIn('id', $used)
                    ->where('start_date', '<=', now())
                    ->where('end_date', '>=', now())
                    ->whereTime('start_time', '<=', now())
                    ->whereTime('end_time', '>=', now())
                    ->whereColumn('limit', '>=', 'total_used')
                    ->count();

                $store['promocodes'] = $promocodes;
            }

            $users = User::where('status', '!=', 'inactive')
                ->where('f_name', 'LIKE', '%' . $request->key . '%')
                ->where('id','<>', Auth::user()->id)
                ->orWhere('phone', 'LIKE', '%' . $request->key . '%')
                ->where('id','<>', Auth::user()->id)
                ->get();
            $array = [];
            foreach ($users as $user){
                $friend = Friends::where('user_id', $cur_user)
                    ->where('friend_id', $user->id)->first();

                if ($friend) {
                    $user->friend_status = $friend->status;
                    $user->requester_id = $friend->requester_id;
                    if($friend->requester_id == $cur_user){
                        $user->type = 'waiting';
                    }else{
                        $user->type = 'has_not_accept';
                    }
                }
                array_push($array, $user);
            }

            $data = [
                'stores' => $stores,
                'users' => $array
            ];

            return ApiResponse::successResponse($data);
        } catch (\Exception $e) {
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
                ->with('products')
                ->has('products')
                ->get();

            $store[0]['categories'] = $productCategories;

            return ApiResponse::successResponse($store);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function getProductDetail($id): JsonResponse
    {
        try {
            $product = Product::where('id', $id)->first();

            return ApiResponse::successResponse($product);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function getCart(): JsonResponse
    {
        try {
            $user = Auth::user();
            $carts = $user->carts;
            $products = [];
            $totalPrice = 0;
            $totalQuantity = 0;

            if (count($carts) > 0) {
                $products = $carts->map(function ($item, $key) use (&$totalPrice, &$totalQuantity) {
                    $totalPrice += $item->total_price;
                    $totalQuantity += $item->quantity;

                    return [
                        'id' => $item->product_id ?? '',
                        'name' => $item->product->name ?? '',
                        'image' => $item->product->image ?? '',
                        'price' => $item->product->price ?? 0,
                        'quantity' => $item->quantity ?? 0,
                        'add_ons' => $item->add_ons ?? [],
                        'add_on_price' => $item->add_ons_price,
                        'total_price' => $item->total_price,
                    ];
                });
            }

            $data = [
                'products' => $products,
                'total_quantity' => $totalQuantity,
                'total_price' => $totalPrice,
                'store' => $carts->first()->store ?? '',
            ];

            return ApiResponse::successResponse($data);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function deleteCart(): JsonResponse
    {
        try {
            $user = Auth::user();
            $user->carts()->delete();

            return ApiResponse::successResponse(null);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function addToCart(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'store_id' => 'required|exists:' . app(Store::class)->getTable() . ',id',
            'product_id' => 'required|exists:' . app(Product::class)->getTable() . ',id',
            'quantity' => 'required|numeric',
            'add_ons' => 'array',
        ], [
            'product_id.exists' => 'Sản phẩm không tồn tại'
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }
        $user = Auth::user();

        $cart = $user->carts()->first();
        if ($cart) {
            if ($request->store_id != $cart->store_id) {
                return APIResponse::FailureResponse('Bạn đang có giỏ hàng ở cửa hàng');
            }
        }

        try {
            DB::beginTransaction();

            $addOns = json_encode($request->add_ons);
            $product = DB::table('carts')->where('user_id', $user->id)
                ->where('product_id', $request->product_id)
                ->where('add_ons', $addOns)
                ->where('store_id', $request->store_id)
                ->first();

            if ($product) {
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
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function updateCart(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'product_id' => 'required|exists:' . app(Product::class)->getTable() . ',id',
            'quantity' => 'required|numeric',
            'add_ons' => 'array',
        ], [
            'product_id.exists' => 'Sản phẩm không tồn tại'
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }
        $user = Auth::user();
        try {
            DB::beginTransaction();

            $addOns = json_encode($request->add_ons);
            if($request->quantity > 0) {
                $product = DB::table('carts')->where('user_id', $user->id)
                    ->where('product_id', $request->product_id)
                    ->where('add_ons', $addOns)
                    ->where('store_id', $request->store_id)
                    ->update([
                        'quantity' => $request->quantity
                    ]);
            } else {
                $product = DB::table('carts')->where('user_id', $user->id)
                    ->where('product_id', $request->product_id)
                    ->where('add_ons', $addOns)
                    ->where('store_id', $request->store_id)
                    ->destroy();
            }

            DB::commit();
            return APIResponse::SuccessResponse($user->carts);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function getStorePromocode(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'store_id' => 'required|exists:' . app(Store::class)->getTable() . ',id',
        ], [
            'store_id.exists' => 'Sản phẩm không tồn tại'
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $used = DB::table('promocode_used')->where('user_id', Auth::user()->id)->pluck('promocode_id')->toArray();

            $promocodes = DB::table('promocodes')
                ->select('*',
                DB::raw('(CASE 
                    WHEN `limit` = 0 THEN 1 
                    WHEN `limit` != 0 AND total_used < `limit` THEN 1
                    ELSE 0 
                    END) AS available'))
                ->where('store_id', $request->store_id)
                ->whereNotIn('id', $used)
                ->where('start_date', '<=', now())
                ->where('end_date', '>=', now())
                ->whereTime('start_time', '<=', now())
                ->whereTime('end_time', '>=', now())
                ->having('available', 1)
                ->get();

            return APIResponse::SuccessResponse($promocodes);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function calcOrderTotal(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'store_id' => 'required|exists:' . app(Store::class)->getTable() . ',id',
            'promocode_id' => 'nullable|integer|exists:' . app(Promocode::class)->getTable() . ',id',
        ], [
            'store_id.exists' => 'Cửa hàng không tồn tại',
            'promocode_id.exists' => 'Mã giảm giá không tồn tại'
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        $user = Auth::user();

        try {
            $carts = $user->carts;
            $cartPrice = 0;
            foreach ($carts as $item) {
                if ($item->store_id != $request->store_id) {
                    return APIResponse::FailureResponse('Đã có lỗi NGHIÊM TRỌNG xảy ra vui lòng thử lại sau');
                }
                $cartPrice += $item->total_price;
            }

            $discount = 0;
            if (isset($request->promocode_id)) {
                $promocode = DB::table('promocodes')
                    ->where('store_id', $request->store_id)
                    ->where('id', $request->promocode_id)
                    ->first();

                $discount = Helper::calcPromocodeDiscount($promocode, $cartPrice);
            }

            $total = $cartPrice - $discount;
            $data = [
                'products_total' => $cartPrice,
                'discount' => $discount,
                'total' => ($total < 0) ? 0 : $total,
            ];
            return APIResponse::SuccessResponse($data);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function createOrder(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'store_id' => 'required|exists:' . app(Store::class)->getTable() . ',id',
            'note' => 'nullable',
            'promocode_id' => 'nullable|integer|exists:' . app(Promocode::class)->getTable() . ',id',
            'message' => 'nullable',
            'wallet_type' => 'in:credit,debit'
        ], [
            'store_id.exists' => 'Cửa hàng không tồn tại',
            'promocode_id.exists' => 'Mã giảm giá không tồn tại'
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        $user = Auth::user();
        $store = Store::select('id', 'user_id', 'name')->where('id', $request->store_id)->first();

        if($store->status == 'closing') {
            return APIResponse::FailureResponse('Cửa hàng đã đóng cửa');
        }

        if ($store->user_id == $user->id) {
            return APIResponse::FailureResponse('Đã có lỗi NGHIÊM TRỌNG xảy ra vui lòng thử lại sau');
        }

        $carts = $user->carts;
        $cartPrice = 0;
        foreach ($carts as $item) {
            if ($item->store_id != $request->store_id) {
                return APIResponse::FailureResponse('Đã có lỗi NGHIÊM TRỌNG xảy ra vui lòng thử lại sau');
            }
            $cartPrice += $item->total_price;
        }

        if (!count($carts)) {
            return APIResponse::FailureResponse('Giỏ hàng của bạn đang trống');
        }

        if (($user->wallet->balance + $user->wallet->credit_limit) < $cartPrice) {
            return APIResponse::FailureResponse('Số dư trong ví không đủ');
        }

        $promocode = null;
        if ($request->promocode_id != null || $request->promocode_id != '') {
            $promocode = Promocode::where('id', $request->promocode_id)->first();
            if ($promocode->limit > 0) {
                if ($promocode->limit = $promocode->total_used) {
                    return APIResponse::FailureResponse('Mã giảm giá đã hết lượt sử dụng');
                }
            }
            if ($promocode->end_date < now() || $promocode->end_time < now()) {
                return APIResponse::FailureResponse('Mã giảm giá đã hết hạn sử dụng');
            }
            if ($promocode->min_purchase > $cartPrice) {
                return APIResponse::FailureResponse('Yêu cầu giá trị đơn hàng của bạn tối thiểu phải là ' . number_format($promocode->min_purchase) . 'đ để có thể áp dụng mã giảm giá này');
            }
            if (DB::table('promocode_used')->where('user_id', $user->id)->where('promocode_id', $request->promocode_id)->count() > 0) {
                return APIResponse::FailureResponse('Bạn đã sử dụng mã giảm giá này rồi');
            }
        }

        try {
            DB::beginTransaction();

            $orderDetails = [];
            $order = new Order;
            $order->order_code = Helper::generateOrderCode();
            $order->user_id = $user->id;
            $order->store_id = $request->store_id;
            $order->promocode_id = $request->promocode_id ?? null;
            $order->order_total = $cartPrice;
            $order->discount_amount = Helper::calcPromocodeDiscount($promocode, $cartPrice);
            $order->status = 'pending';
            $order->note = $request->note ?? null;

            foreach ($carts as $cart) {
                $orderDetails[] = [
                    'product_id' => $cart->product_id,
                    'name' => $cart->product->name,
                    'price' => $cart->product->price,
                    'add_ons' => $cart->add_ons,
                    'quantity' => $cart->quantity,
                    'add_ons_price' => $cart->add_ons_price,
                    'total_price' => $cart->total_price
                ];
            }

            $order->product_detail = json_encode($orderDetails);
            $order->created_at = now();
            $order->updated_at = now();
            $order->save();

            $user->carts()->delete();

            if (isset($promocode)) {
                DB::table('promocode_used')->insert([
                    'user_id' => $user->id,
                    'order_id' => $order->id,
                    'promocode_id' => $promocode->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $promocode->total_used += 1;
                $promocode->save();
            }

            $total = $order->order_total - $order->discount_amount;

            $merchant = $store->user;
            $userWallet = $user->wallet;
            $merchantWallet = $merchant->wallet;

            if($request->wallet_type == 'debit') {
                if($total > $userWallet->balance)
                    return ApiResponse::failureResponse('Số dư trong ví không đủ để thanh toán đơn hàng');
            } else {
                if($total > $userWallet->credit_limit)
                    return ApiResponse::failureResponse('Số dư trong ví tín dụng không đủ để thanh toán đơn hàng');
            }

            $transaction = Transaction::create([
                'code' => Helper::generateNumber(),
                'amount' => Crypt::encryptString($total),
                'from_id' => $user->id,
                'to_id' => $merchant->id,
                'order_id' => $order->id,
                'type' => 'O',
                'title' => 'Thanh toán đơn hàng ' . $store->name,
                'message' => Crypt::encryptString('Thanh toán ' . number_format($total) . 'đ cho đơn hàng ' . $order->order_code),
                'wallet_type' => $request->wallet_type
            ]);

            if($request->wallet_type == 'debit') {
                // trừ tiền vào ví của user
                $userOpenBalance = $userWallet->balance;
                $userWallet->balance = $userWallet->balance - $total;
                $userCloseBalance = $userWallet->balance;

                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'user_id' => $user->id,
                    'open_balance' => $userOpenBalance,
                    'close_balance' => $userCloseBalance,
                ]);
            } else {
                // trừ tiền vào ví tín dụng của user
                $userOpenBalance = $userWallet->credit_limit;
                $userWallet->credit_limit = $userWallet->credit_limit - $total;
                $userCloseBalance = $userWallet->credit_limit;

                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'user_id' => $user->id,
                    'open_balance' => $userOpenBalance,
                    'close_balance' => $userCloseBalance,
                ]);
            }

            $merchantOpenBalance = $merchantWallet->balance;
            $merchantWallet->balance = $merchantWallet->balance + $total;
            $merchantCloseBalance = $merchantWallet->balance;

            TransactionDetail::create([
                'transaction_id' => $transaction->id,
                'user_id' => $merchant->id,
                'open_balance' => $merchantOpenBalance,
                'close_balance' => $merchantCloseBalance,
                'message' => $request->message
            ]);

            $merchantWallet->save();
            $userWallet->save();

            Notification::create([
                'user_id' => $merchant->id,
                'tag' => 'Đơn hàng',
                'tag_model' => 'orders',
                'tag_model_id' => $order->id,
                'title' => 'Thanh toán đơn hàng',
                'body' => $user->full_name . 'vừa thanh toán ' . $total . 'đ cho đơn hàng '. $order->order_code,
            ]);

            DB::commit();
            $data = [
                'request_id' => $order->id,
            ];
            (new SendPushNotification)->merchantNewOrder($merchant, $store->id, $order->id);
            return APIResponse::SuccessResponse($data);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse('Đặt hàng không thành công. Vui lòng thử lại sau');
        }
    }

    public function getOrderDetail(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'order_id' => 'required|exists:' . app(Order::class)->getTable() . ',id',
        ], [
            'order_id.exists' => 'Đơn hàng không tồn tại',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $order = Order::select('*', DB::raw('(order_total - discount_amount) as order_total'))
                ->with('user', 'store')
                ->where('id', $request->order_id)
                ->first();

            return APIResponse::SuccessResponse($order);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function cancelOrder(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'order_id' => 'required|exists:' . app(Order::class)->getTable() . ',id',
        ], [
            'order_id.exists' => 'Đơn hàng không tồn tại',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            DB::beginTransaction();
            $order = Order::where('id', $request->order_id)
                ->where('user_id', Auth::user()->id)
                ->firstOrFail();
                
            if ($order->status == 'processing') {
                return APIResponse::FailureResponse('Không thể hủy đơn hàng vì cửa hàng đang chuẩn bị cho đơn hàng của bạn');
            }

            if ($order->status == 'canceled') {
                return APIResponse::FailureResponse('Đơn hàng đã bị hủy');
            }

            if ($order->status == 'finished') {
                return APIResponse::FailureResponse('Không thể hủy đơn hàng vì cửa hàng đã chuẩn bị xong đơn hàng và đang chờ bạn đến lấy');
            }
            $order->status = 'canceled';
            $order->canceled_at = now();
            $order->save();

            Helper::refund($order);

            DB::commit();
            return APIResponse::SuccessResponse(null);
        } catch (\Exception $e) {
            DB::rollBack();
            return APIResponse::FailureResponse($e->getMessage());
        }
    }

    public function takenOrder(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'order_id' => 'required|exists:' . app(Order::class)->getTable() . ',id',
            'taken_code' => 'required',
        ], [
            'order_id.exists' => 'Đơn hàng không tồn tại',
            'taken_code.required' => 'Vui lòng nhập mã nhận hàng'
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $order = Order::where('id', $request->order_id)
                ->where('user_id', Auth::user()->id)
                ->firstOrFail();

            if($order->taken_code !== $request->taken_code) {
                return APIResponse::FailureResponse('Mã nhận hàng không hợp lệ');
            }

            if ($order->status == 'canceled') {
                return APIResponse::FailureResponse('Đơn hàng đã bị hủy');
            }

            if ($order->status != 'finished') {
                return APIResponse::FailureResponse('Đơn hàng vẫn chưa được chuẩn bị xong');
            }

            $order->status = 'taken';
            $order->taken_at = now();
            $order->save();

            return APIResponse::SuccessResponse(null);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse('Không thể hủy đơn hàng. Đã có lỗi xảy ra');
        }
    }

    public function getOrder(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'limit' => 'required|integer',
            'page' => 'required|integer',
            'status' => ''
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $orders = Order::select('*', DB::raw('(order_total - discount_amount) as order_total'))->where('user_id', Auth::user()->id)->with('store:id,name');

            if ($request->status == 'taken') {
                $orders = $orders->where('status', 'taken')->orWhere('status', 'canceled');
            } else {
                $orders = $orders->where('status', '!=', 'taken')->where('status', '!=', 'canceled');
            }

            if ($request->page) {
                $limit = $request->limit;
                $page = $request->page;
                $offset = ($page - 1) * $limit;
                $orders = $orders->offset($offset)->limit($limit);
            }
            $totalOrders = $orders->count();
            $orders = $orders->orderBy('created_at', 'desc')->get();

            foreach($orders as $order) {
                $order['store_name'] = $order->store->name;
                unset($order['store']);
            }

            $data = [
                'total_size' => $totalOrders,
                'limit' => $limit,
                'page' => $page,
                'orders' => $orders
            ];

            return ApiResponse::successResponse($data);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function getMyShareBill(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'limit' => 'required|integer',
            'page' => 'required|integer',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $user = Auth::user();

            $bills = DB::table('share_bills')
                ->select(
                    'share_bills.id', 
                    'share_bills.created_at', 
                    'share_bills.order_id', 
                    DB::raw("CONCAT('Hóa đơn chia tiền cho đơn hàng tại ', stores.name) AS title"),
                    DB::raw('(SELECT COUNT(*) FROM share_bills WHERE orders.id = share_bills.order_id AND share_bills.status = "paid") as paid_count'),
                    DB::raw('(SELECT COUNT(*) FROM share_bills WHERE orders.id = share_bills.order_id AND share_bills.is_owner = 0) as total'))
                ->leftJoin('orders', 'orders.id', '=', 'share_bills.order_id')
                ->leftJoin('stores', 'stores.id', '=', 'orders.store_id')
                ->where('owner_id', $user->id)
                ->where('is_owner', true)
                ->get();

            return ApiResponse::successResponse($bills);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        } 
    }

    public function createShareBill(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'detail' => 'required',
            'order_id' => 'required|exists:' . app(Order::class)->getTable() . ',id',
            'message' => '',
            'image' => '',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            DB::beginTransaction();

            $user = Auth::user();
            $order = Order::where('id', $request->order_id)->where('status', 'taken')->first();
            if (!isset($order)) {
                return APIResponse::FailureResponse('Đơn hàng của bạn chưa hoàn thành');
            }

            $details = json_decode(json_encode($request->detail), true);
            foreach($details as $detail) {
                $bill = ShareBill::updateOrCreate([
                    'order_id' => $order->id,
                    'shared_id' => $detail['user_id'],
                ],[
                    'amount' => $detail['amount'],
                    'status' => ($detail['user_id'] == $user->id) ? null : 'pending',
                    'payment_type' => null,
                    'is_owner' => ($detail['user_id'] == $user->id) ? true : false,
                    'owner_id' => $user->id,
                ]);

                if($detail['user_id'] != $user->id) {
                    Notification::create([
                        'user_id' => $detail['user_id'],
                        'tag' => 'Chia tiền',
                        'tag_model' => 'share_bills',
                        'tag_model_id' => $order->id,
                        'title' => $user->f_name . ' đang rủ bạn chia tiền',
                        'body' => $user->f_name . ' đang chờ bạn chuyển ' . number_format($detail['amount']) . 'đ. Chuyển nhanh kẻo bạn ấy chờ lâu nha!',
                    ]);
                }
            }

            DB::commit();
            return ApiResponse::successResponse(null);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function getShareBillDetail(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'order_id' => 'required|exists:' . app(Order::class)->getTable() . ',id',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            DB::beginTransaction();

            $bills = ShareBill::select(
                '*',
                DB::raw('(CASE WHEN share_bills.shared_id = ' . Auth::user()->id . ' THEN 1 ELSE 0 END) AS is_your')
            )->where('order_id', $request->order_id)->get();

            DB::commit();
            return ApiResponse::successResponse($bills);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function payShareBill(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'bill_id' => 'required|exists:' . app(ShareBill::class)->getTable() . ',id',
            'message' => 'required',
        ], [
            'message' => 'Vui lòng nhập lời nhắn xác nhận trả tiền',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            DB::beginTransaction();

            $user = Auth::user();

            $bill = ShareBill::where('id', $request->bill_id)->where('shared_id', $user->id)->first();
            $bill->status = 'paid';
            $bill->payment_type = 'other';
            $bill->save();

            $message = null;
            if(isset($request->message)) {
                $message = $request->message;
            } else {
                $message = $user->f_name . ' đã trả cho bạn ' . number_format($bill->amount) . 'đ qua hình thức khác';
            }

            Notification::create([
                'user_id' => $bill->order->user_id,
                'tag' => 'Chia tiền',
                'tag_model' => 'share_bills',
                'tag_model_id' => $bill->order->id,
                'title' => $user->f_name . ' báo đã trả tiền cho bạn',
                'body' => $message,
            ]);

            DB::commit();
            return ApiResponse::successResponse(null);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function getShareBill(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'limit' => 'required|integer',
            'page' => 'required|integer',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $user = Auth::user();

            $bills = DB::table('share_bills')
                ->select(
                    'share_bills.id',
                    'share_bills.created_at',
                    'share_bills.order_id',
                    DB::raw("CONCAT('Hóa đơn chia tiền từ ', users.f_name) AS title"),
                    DB::raw('(SELECT COUNT(*) FROM share_bills WHERE orders.id = share_bills.order_id AND share_bills.status = "paid") as paid_count'),
                    DB::raw('(SELECT COUNT(*) FROM share_bills WHERE orders.id = share_bills.order_id AND share_bills.is_owner = 0) as total'))
                ->leftJoin('orders', 'orders.id', '=', 'share_bills.order_id')
                ->leftJoin('users', 'users.id', '=', 'orders.user_id')
                ->where('shared_id', $user->id)
                ->where('share_bills.status', 'pending')
                ->where('is_owner', false)
                ->get();

            return ApiResponse::successResponse($bills);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function getPaidShareBill(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'limit' => 'required|integer',
            'page' => 'required|integer',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $user = Auth::user();

            $bills = DB::table('share_bills')
                ->select('share_bills.id', 'share_bills.order_id', 'transactions.created_at', 'share_bills.transaction_id', DB::raw("CONCAT(users.f_name, ' đã trả ', FORMAT(share_bills.amount, 0), 'đ') AS title"))
                ->leftJoin('transactions', 'transactions.id', '=', 'share_bills.transaction_id')
                ->leftJoin('users', 'users.id', '=', 'transactions.from_id')
                ->join('transaction_details', function (JoinClause $join) use ($user) {
                    $join->on('transaction_details.transaction_id', '=', 'transactions.id')
                            ->where('user_id', $user->id);
                })
                ->where('owner_id', $user->id)
                ->where('share_bills.status', 'paid')
                ->get();

            return ApiResponse::successResponse($bills);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function remindPayShareBill(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'order_id' => 'required|integer',
            'message' => 'required|'
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $user = Auth::user();

            $bills = DB::table('share_bills')
                ->where('order_id', $request->order_id)
                ->where('owner_id', Auth::user()->id)
                ->where('status', '!=', 'paid')
                ->get();

            foreach($bills as $bill)
            {
                if($bill->shared_id != Auth::user()->id) {
                    $shared = User::where('id', $bill->shared_id)->first();
                    $text = $user->f_name . ' đã nhắc bạn trả tiền';

                    Notification::create([
                        'user_id' => $bill->shared_id,
                        'tag' => 'Chia tiền',
                        'tag_model' => 'share_bills',
                        'tag_model_id' => $bill->order_id,
                        'title' => $text,
                        'body' => $request->message,
                    ]);

                    (new SendPushNotification)->userApproveRequest($shared, $text);
                }
            }

            return ApiResponse::successResponse(null);
        } catch (\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }
}
