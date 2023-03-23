<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Models\AddOn;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Promocode;
use App\Models\Store;
use App\Models\StoreSchedule;
use Carbon\Carbon;
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
        $validate = Validator::make($request->all(), [
            'store_id' => 'required|integer',
            'name' => 'required|max:255',
            'price' => 'required|integer',
            'image' => 'required|mimes:jpeg,jpg,png',
            'category_id' => 'required|integer',
        ], [
            'name.required' => 'Vui lòng nhập tên sản phẩm',
            'name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự',
            'price.required' => 'Vui lòng giá tiền của sản phẩm',
            'image.required' => 'Vui lòng chọn hình ảnh cho sản phẩm của bạn',
            'category_id.required' => 'Vui lòng chọn danh mục sản phẩm của sản phẩm',
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
            try {
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

                    if(isset($value->price)){
                        AddOn::where('id', $value->id)->update([
                           'price' => $value->price
                        ]);
                    }
                    array_push($newAddOns, $value->id);
                }
            } catch(Exception $e) {
                return ApiResponse::failureResponse($e);
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

    public function deleteProductCategory(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'id' => 'required|integer|exists:'.app(ProductCategory::class)->getTable().',id',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try{
            DB::beginTransaction();

            $productCategory = ProductCategory::where('id', $request->id)->first();
            $products = $productCategory->products->count();
            if($products > 0)
            {
                return APIResponse::FailureResponse('Không thể xóa do đang có món ăn thuộc danh sách này');
            }
            
            $productCategory->delete();

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
                ->select('id', 'name as category_name')
                ->with('products')
                ->withCount('products')
                ->get();

			return APIResponse::SuccessResponse($categories);
        } catch(Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function getProductCategory(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'store_id' => 'required',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $categories = ProductCategory::where('store_id', $request->store_id)
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

    public function createAddon(Request $request)
    {
        try{
            $validate = Validator::make($request->all(), [
                'store_id' => 'required|integer|exists:'.app(Store::class)->getTable().',id',
                'name' => 'required',
                'price' => 'required|integer',
            ]);

            if ($validate->fails()) {
                return APIResponse::FailureResponse($validate->messages()->first());
            }

            $addon = AddOn::where('store_id', $request->store_id)->where('name', $request->name)->get();
            if($addon->count() > 0) {
                return ApiResponse::failureResponse('Món thêm này đã tồn tại');
            }

            AddOn::create(
                [
                    'name' => $request->name,
                    'price' => $request->price,
                    'store_id' => $request->store_id,
                ]
            );

            return APIResponse::SuccessResponse(null);
        } catch(Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function updateAddon(Request $request)
    {
        try{
            $validate = Validator::make($request->all(), [
                'store_id' => 'required|integer|exists:'.app(Store::class)->getTable().',id',
                'id' => 'required|integer|exists:'.app(AddOn::class)->getTable().',id',
                'name' => 'required',
                'price' => 'required|integer',
            ]);

            if ($validate->fails()) {
                return APIResponse::FailureResponse($validate->messages()->first());
            }

            $addOn = AddOn::where('id', $request->id)->update(
                [
                    'name' => $request->name,
                    'price' => $request->price,
                    'store_id' => $request->store_id,
                ]
            );

            return APIResponse::SuccessResponse(null);
        } catch(Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function deleteAddon(Request $request)
    {
        try{
            $validate = Validator::make($request->all(), [
                'id' => 'required|integer|exists:'.app(AddOn::class)->getTable().',id',
            ]);

            if ($validate->fails()) {
                return APIResponse::FailureResponse($validate->messages()->first());
            }

            $addOn = AddOn::where('id', $request->id)->delete();

            return APIResponse::SuccessResponse(null);
        } catch(Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function getTimeActive(Request $request)
    {
        try{
            $validate = Validator::make($request->all(), [
                'store_id' => 'required|integer',
            ]);
            if ($validate->fails()) {
                return APIResponse::FailureResponse($validate->messages()->first());
            }
            $data = StoreSchedule::select('id','day','opening_time','closing_time')->where('store_id', $request->store_id)->get();
            if(count($data) == 0){
                $data = $this->initTimeActive($request->store_id);
            }
            return APIResponse::SuccessResponse($data);
		} catch (\Exception $e) {
            return APIResponse::FailureResponse($e->getMessage());
		}
    }

    private function initTimeActive($storeId)
    {
        $data = [];
        $timeNow = Carbon::now();
        $openingTime = Carbon::createFromFormat('H:i:s', '10:00:00')->format('H:i:s');
        $closingTime = Carbon::createFromFormat('H:i:s', '18:00:00')->format('H:i:s');
        for ($i=2; $i <= 8; $i++) { 
            array_push($data, [
                'store_id' => $storeId,
                'day' => $i,
                'opening_time' => $openingTime,
                'closing_time' => $closingTime,
                'created_at'  => $timeNow,
                'updated_at'  => $timeNow,
            ]);
        }
        StoreSchedule::insert($data);
        return $data;
    }

    public function updateTimeActive(Request $request)
    {
        try{
            $validate = Validator::make($request->all(), [
                'flag_set_all' => 'required|integer|in:0,1',
                'day_id' => 'integer|required_if:flag_set_all,0',
                'store_id' => 'required|integer',
                'opening_time' => 'required|date_format:H:i:s',
                'closing_time' => 'required|date_format:H:i:s',
            ],[
                'day_id.required_if' => 'Trường day_id không được bỏ trống.'
            ]);
            if ($validate->fails()) {
                return APIResponse::FailureResponse($validate->messages()->first());
            }

            $openingTime = Carbon::createFromFormat('H:i:s', $request->opening_time)->format('H:i:s');
            $closingTime = Carbon::createFromFormat('H:i:s', $request->closing_time)->format('H:i:s');
            
            if ($request->flag_set_all){
                StoreSchedule::where("store_id", $request->store_id)
                ->update(
                    [
                        "opening_time" => $openingTime,
                        "closing_time" => $closingTime,
                    ]
                );
            }else {
                StoreSchedule::where("day", $request->day_id)
                ->where("store_id", $request->store_id)
                ->update(
                    [
                        "opening_time" => $openingTime,
                        "closing_time" => $closingTime,
                    ]
                );
            }
            return APIResponse::SuccessResponse(null);
		} catch (\Exception $e) {
            return APIResponse::FailureResponse($e->getMessage());
		}
    }

    public function getPromocode(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'store_id' => 'required|integer|exists:'.app(Store::class)->getTable().',id',
            'limit' => 'integer',
            'page' => 'integer',
            'status' => 'required|in:RUNNING,UPCOMING,FINISHED',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $promocodes = Promocode::where('store_id', $request->store_id)
                ->orderBy('created_at','desc');

            $today = Carbon::now();
            if ($request->status == 'RUNNING') {
                $promocodes = $promocodes->where('start_date', '<=', $today)->where('end_date', '>=', $today);          
            } else if($request->status == 'UPCOMING') {
                $promocodes = $promocodes->where('start_date', '>', $today);
            } else {
                $promocodes = $promocodes->where('end_date','<', $today);
            }

            if($request->limit && $request->page){
                $limit = $request->limit;
                $page = $request->page;
                $offset = ($page-1) * $limit;

                $promocodes = $promocodes->offset($offset)->limit($limit);
            }

            $promocodes = $promocodes->get();
            return APIResponse::SuccessResponse($promocodes);
        } catch (\Exception $e) {
            return APIResponse::FailureResponse($e->getMessage());
		}
    }

    public function createPromocode(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'code' => 'required|string|max:255',
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s',
            'discount' => 'required|integer',
            'discount_type' => 'required|in:amount,percentage',
            'max_discount' => 'numeric',
            'min_purchase' => 'numeric|min:0',
            'limit' => 'numeric',
            'store_id' => 'required|numeric',
        ],[
            'discount.min' => 'Số tiền giảm giá không được nhỏ hơn 0'
        ]);
        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $startDate = Carbon::createFromFormat('Y-m-d', $request->start_date);
            $endDate = Carbon::createFromFormat('Y-m-d', $request->end_date);

            $startTime = Carbon::createFromFormat('H:i:s', $request->start_time);
            $endTime = Carbon::createFromFormat('H:i:s', $request->end_time);

            if($startDate > $endDate){
                return APIResponse::FailureResponse('Ngày bắt đầu phải trước ngày kết thúc');
            }

            if($request->discount_type == 'percentage' && $request->discount > 100) {
                return APIResponse::FailureResponse('Giá trị giảm giá không được vượt quá 100%');
            }

            $promocode = new Promocode;
            $promocode->store_id = $request->store_id;
            $promocode->code = $request->code;
            $promocode->start_date = $startDate;
            $promocode->end_date = $endDate;
            $promocode->start_time = $startTime;
            $promocode->end_time = $endTime;
            $promocode->discount = $request->discount;
            $promocode->discount_type = $request->discount_type;
            $promocode->max_discount = $request->max_discount;
            $promocode->min_purchase = $request->min_purchase;
            $promocode->limit = $request->limit ?? 0;
            $promocode->total_used = 0;

            $promoDescription = "";
            if ($request->discount_type == 'percentage') {
                $promoDescription = "Giảm ". $request->discount ."%, tối đa ". $promocode->max_discount . "đ cho đơn hàng từ ". $promocode->min_purchase."đ trở lên";
            } else {
                $promoDescription = "Giảm ". $request->discount ."đ cho đơn hàng từ ". $promocode->min_total_order."đ trở lên trên";
            }
            $promocode->title = $promoDescription;

            $promocode->save();
            return APIResponse::SuccessResponse(null);
        } catch (\Exception $e) {
            return APIResponse::FailureResponse($e->getMessage());
		}
    }

    public function updatePromocode(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'promo_id' => 'required|exists:'.app(Promocode::class)->getTable().',id',
            'code' => 'required|string|max:255',
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s',
            'discount' => 'required|integer',
            'discount_type' => 'required|in:amount,percentage',
            'max_discount' => 'numeric',
            'min_purchase' => 'numeric|min:0',
            'limit' => 'numeric',
            'store_id' => 'required|numeric',
        ],[
            'discount.min' => 'Số tiền giảm giá không được nhỏ hơn 0'
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $startDate = Carbon::createFromFormat('Y-m-d', $request->start_date);
            $endDate = Carbon::createFromFormat('Y-m-d', $request->end_date);

            $startTime = Carbon::createFromFormat('H:i:s', $request->start_time);
            $endTime = Carbon::createFromFormat('H:i:s', $request->end_time);

            if($startDate >= now()) {
                return APIResponse::FailureResponse('Mã giảm giá phải bắt đầu từ ngày hôm nay hoặc sau ngày hôm nay');
            }
            if($startDate > $endDate) {
                return APIResponse::FailureResponse('Ngày bắt đầu phải trước ngày kết thúc');
            }

            if($request->discount_type == 'percentage' && $request->discount > 100) {
                return APIResponse::FailureResponse('Giá trị giảm giá không được vượt quá 100%');
            }

            $promocode = Promocode::where('id', $request->promo_id)->where('store_id', $request->store_id)->first();
            $promocode->start_date = $startDate;
            $promocode->end_date = $endDate;
            $promocode->start_time = $startTime;
            $promocode->end_time = $endTime;
            $promocode->discount = $request->discount;
            $promocode->discount_type = $request->discount_type;
            $promocode->max_discount = $request->max_discount;
            $promocode->min_purchase = $request->min_purchase;
            $promocode->limit = $request->limit ?? 0;
            $promocode->total_used = 0;

            $promoDescription = "";
            if ($request->discount_type == 'percentage') {
                $promoDescription = "Giảm ". $request->discount ."%, tối đa ". $promocode->max_discount . "đ cho đơn hàng từ ". $promocode->min_purchase."đ trở lên";
            } else {
                $promoDescription = "Giảm ". $request->discount ."đ cho đơn hàng từ ". $promocode->min_total_order."đ trở lên trên";
            }
            $promocode->title = $promoDescription;

            $promocode->save();
            return APIResponse::SuccessResponse(null);
        } catch (\Exception $e) {
            return APIResponse::FailureResponse($e->getMessage());
		}
    }

    public function cancelPromocode(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'promo_id' => 'required|exists:'.app(Promocode::class)->getTable().',id',
            'store_id' => 'required|numeric',
        ],[
            'discount.min' => 'Số tiền giảm giá không được nhỏ hơn 0'
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $promocode = Promocode::where('id', $request->promo_id)->where('store_id', $request->store_id)->first();
            $promocode->end_date = now();
            $promocode->end_time = now();
            $promocode->save();
            return APIResponse::SuccessResponse(null);
        } catch (\Exception $e) {
            return APIResponse::FailureResponse($e->getMessage());
		}
    }

    public function getOrder(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'store_id' => 'required|exists:'.app(Store::class)->getTable().',id',
            'limit' => 'required|integer',
            'page' => 'required|integer',
            'status' => 'required|in:pending,processing,finished'
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $orders = Order::select('id', 'order_code', 'created_at', 'user_id', 'order_total')
                ->where('store_id', $request->store_id)
                ->where('status', $request->status)
                ->orderBy('created_at');

            if ($request->page) {
                $limit = $request->limit;
                $page = $request->page;
                $offset = ($page - 1) * $limit;
                $orders = $orders->offset($offset)->limit($limit);
            }
            $totalOrders = $orders->count();
            $orders = $orders->get();

            $data = [
                'total_size' => $totalOrders,
                'limit' => $limit,
                'page' => $page,
                'orders' => $orders
            ];

            return ApiResponse::successResponse($data);
        } catch(\Exception $e) {
            return APIResponse::FailureResponse($e->getMessage());
        }
    }

    public function getHistoryOrder(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'store_id' => 'required|exists:'.app(Store::class)->getTable().',id',
            'limit' => 'required|integer',
            'page' => 'required|integer',
            'status' => 'required|in:taken,canceled',
            'date' => 'date_format:Y-m-d'
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $date = $request->date ?? now();

            $orders = Order::select('id', 'order_code', 'created_at', 'user_id', 'order_total', 'discount_amount')
                ->whereDate('created_at', $date)
                ->where('store_id', $request->store_id)
                ->where('status', $request->status);

            if ($request->page) {
                $limit = $request->limit;
                $page = $request->page;
                $offset = ($page - 1) * $limit;
                $orders = $orders->offset($offset)->limit($limit);
            }
            $totalOrders = $orders->count();
            $orders = $orders->get();

            $data = [
                'total_size' => $totalOrders,
                'limit' => $limit,
                'page' => $page,
                'orders' => $orders
            ];

            return ApiResponse::successResponse($data);
        } catch(\Exception $e) {
            return APIResponse::FailureResponse($e->getMessage());
        }
    }

    public function getOrderDetail(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'order_id' => 'required|exists:'.app(Order::class)->getTable().',id',
            'store_id' => 'required|exists:'.app(Store::class)->getTable().',id',
        ], [
            'order_id.exists' => 'Đơn hàng không tồn tại',
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            $order = Order::with('user')
                ->where('id', $request->order_id)
                ->where('store_id', $request->store_id)
                ->first();
                
            if(!isset($order)) return APIResponse::FailureResponse('Không tìm thấy đơn hàng');
            
            $order['product_count'] = count($order->product_detail);
            return APIResponse::SuccessResponse($order);
        } catch(\Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }

    public function updateOrderStatus(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'order_id' => 'required|exists:'.app(Order::class)->getTable().',id',
            'status' => 'required|in:processing,finished,accepted,canceled',
            'cancel_reason' => 'required_if:status,==,canceled'
        ], [
            'order_id.exists' => 'Đơn hàng không tồn tại',
            'cancel_reason.required_if' => 'Vui lòng nhập lí do hủy đơn hàng'
        ]);

        if ($validate->fails()) {
            return APIResponse::FailureResponse($validate->messages()->first());
        }

        try {
            DB::beginTransaction();
            $order = Order::with('user')
                ->where('id', $request->order_id)
                ->where('store_id', $request->store_id)
                ->first();

            if(!isset($order)) return APIResponse::FailureResponse('Không tìm thấy đơn hàng');

            if($request->status == 'canceled') {
                if($order->status != 'pending') return APIResponse::FailureResponse('Đã có lỗi xảy ra khi hủy đơn hàng');
                $order->status = 'canceled';
                $order->canceled_at = now();
                $order->cancel_reason = $request->cancel_reason;
            } else if($request->status == 'accepted') {
                if($order->status != 'pending') return APIResponse::FailureResponse('Đã có lỗi xảy ra khi tiếp nhận đơn hàng');
                $order->status = 'accepted';
                $order->accepted_at = now();
            } else if($request->status == 'processing') {
                if($order->status != 'accepted') return APIResponse::FailureResponse('Đã có lỗi xảy ra khi thực hiện đơn hàng');
                $order->status = 'processing';
                $order->processing_at = now();
            } else {
                if($order->status != 'processing') return APIResponse::FailureResponse('Đã có lỗi xảy ra khi hoàn thành đơn hàng');
                $order->status = 'finished';
                $order->finished_at = now();
            }
            $order->save();

            DB::commit();
            return APIResponse::SuccessResponse($order);
        } catch(\Exception $e) {
            DB::rollBack();
            return ApiResponse::failureResponse($e->getMessage());
        }
    }
}
