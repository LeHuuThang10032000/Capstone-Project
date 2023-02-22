<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\api\FriendsResource;
use App\Http\Response\ApiResponse;
use App\Models\Friends;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use function League\Uri\validate;

class FriendsController extends Controller
{
    public function index()
    {
        $user = Auth::user()->id;
        $friends = Friends::where('user_id', $user)->get();
        $id = [];
        foreach ($friends as $friend) {
            array_push($id, $friend->friend_id);
        }
        $users = User::whereIn('id', $id)->get();
//        return $users;
        return FriendsResource::collection($users);
    }

    public function store(Request $request)
    {
        $validations = Validator::make($request->all(), [
            'friend_id' => 'required'
        ], [
            'friend_id.required' => 'Field must fill'
        ]);

        if ($validations->fails()) {
            return ApiResponse::failureResponse($validations->messages()->first());
        }

        $hasAlreadyRelationship = Friends::where('user_id', Auth::user()->id)->where('friend_id', $request->friend_id)->first();

        if ($hasAlreadyRelationship) {
            return ApiResponse::failureResponse(
                'You had already add this friend before'
            );
        }

        $friend = new Friends();
        $friend->user_id = Auth::user()->id;
        $friend->friend_id = $request->friend_id;
        $friend->save();

        return ApiResponse::successResponse([
            'message' => 'You are friends now'
        ]);
    }

    public function destroy(Request $request)
    {
        try {
            $validations = Validator::make($request->all(), [
                'friend_id' => 'required'
            ]);
    
            if ($validations->fails()) {
                return ApiResponse::failureResponse($validations->messages()->first());
            }
    
            $relationship = Friends::where('user_id', Auth::user()->id)->where('friend_id', $request->friend_id)->first();
    
            if (!$relationship) {
                return ApiResponse::failureResponse(
                    'Hai bạn chưa phải là bạn bè'
                );
            }
    
            $relationship->delete();
    
            return ApiResponse::successResponse(null);
        } catch(Exception $e) {
            return ApiResponse::failureResponse($e->getMessage());
        }
    }
}
