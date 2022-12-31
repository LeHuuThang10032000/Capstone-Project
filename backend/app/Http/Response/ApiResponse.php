<?php

namespace App\Http\Response;

class ApiResponse
{
    /**
     * Return success response format json.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public static function successResponse($data, $statusCode = 200)
    {
        return response()->json(
            [
                'isSuccess' => true,
                'error' => null,
                'data' => $data
            ], $statusCode
        );
    }

    /**
     * @param string $message
     * @param $data
     * @param int $statusCode
     * @return \Illuminate\Http\JsonResponse
     */
    public static function failureResponse(string $message, $data=null, int $statusCode=400): \Illuminate\Http\JsonResponse
    {
        return response()->json(
            [
                'isSuccess' => false,
                'error' => $message,
                'data' => $data
            ], $statusCode
        );
    }
}