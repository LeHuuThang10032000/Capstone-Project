<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function update(Request $request):Response
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

    public function getProfile(){
        if(auth::check()){
            $user = auth()->user();
            auth()->user()->media->all();
            return ApiResponse::successResponse($user);
        }
    }

    public function profileUpdate(Request $request)
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

    public function createStoreRequest(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'user_id' => 'required|integer',
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
            return response()->json($validate->messages()->first());
        }

        try{
            DB::beginTransaction();
            
            $store = Store::create([
                'user_id' => $request->id,
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'selling_products' => $request->selling_products,
                'location' => $request->location,
                'image' => $request->image,
                'status' => 'pending',
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
}
