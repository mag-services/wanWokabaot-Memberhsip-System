<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('members', App\Http\Controllers\Api\MemberController::class);
Route::apiResource('products', App\Http\Controllers\Api\ProductController::class);

Route::get('/test', function () {
    return ['message' => 'test'];
});
