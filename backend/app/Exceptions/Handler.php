<?php

namespace App\Exceptions;

use App\Http\Response\ApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        if ($request->is('api/*')) {
            if ($exception instanceof ValidationException) {
                $message = $exception->validator->messages()->first();
                return APIResponse::FailureResponse($message, null, 422);
            }

            if($exception instanceof AuthenticationException){
                return APIResponse::FailureResponse($exception->getMessage(), null, 401);
            }

            if($exception instanceof QueryException){
                return APIResponse::FailureResponse($exception->getMessage(),null, 404);
            }

            if($exception instanceof ModelNotFoundException){
                return APIResponse::FailureResponse( __('Data not found'),null, 404);
            }

            if ($exception->getMessage()) {
                return APIResponse::FailureResponse($exception->getMessage());
            }

            return parent::render($request, $exception);
        }

        return parent::render($request, $exception);
    }

    protected function unauthenticated($request, AuthenticationException $exception)
    {
        if ($request->expectsJson()) {
            return ApiResponse::FailureResponse('Unauthenticated.', null, 401);
        }

        return redirect()->guest('login');
    }
}
