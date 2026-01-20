<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\InventoryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Models\Product;
use Inertia\Inertia;
use App\Http\Controllers\Settings\UserManagementController;
use App\Http\Controllers\Settings\RolesPermissionsController;
use App\Http\Controllers\POSController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/members', [MemberController::class, 'index'])
        ->name('web.members.index');
    Route::post('/members', [MemberController::class, 'store'])
        ->name('web.members.store');
    Route::put('/members/{member}', [MemberController::class, 'update'])
        ->name('web.members.update');
    Route::delete('/members/{member}', [MemberController::class, 'destroy'])
        ->name('web.members.destroy');

    Route::get('/inventory', [InventoryController::class, 'index'])
        ->name('web.inventory.index');
    Route::post('/inventory', [InventoryController::class, 'store'])
        ->name('web.inventory.store');
    Route::put('/inventory/{product}', [InventoryController::class, 'update'])
        ->name('web.inventory.update');
    Route::delete('/inventory/{product}', [InventoryController::class, 'destroy'])
        ->name('web.inventory.destroy');

    // Settings: User Management, Roles & Permissions (restricted to Admin only)
    Route::middleware(\App\Http\Middleware\RestrictSettingsAccess::class)->group(function () {
        Route::get('/settings/users', [UserManagementController::class, 'index'])
            ->name('settings.users');
        Route::post('/settings/users', [UserManagementController::class, 'store'])
            ->name('settings.users.store');
        Route::put('/settings/users/{user}', [UserManagementController::class, 'update'])
            ->name('settings.users.update');
        Route::delete('/settings/users/{user}', [UserManagementController::class, 'destroy'])
            ->name('settings.users.destroy');

        Route::get('/settings/roles-permissions', [RolesPermissionsController::class, 'index'])
            ->name('settings.roles-permissions');
        Route::post('/settings/roles-permissions', [RolesPermissionsController::class, 'store'])
            ->name('settings.roles-permissions.store');
        Route::put('/settings/roles-permissions/{role}', [RolesPermissionsController::class, 'update'])
            ->name('settings.roles-permissions.update');
        Route::delete('/settings/roles-permissions/{role}', [RolesPermissionsController::class, 'destroy'])
            ->name('settings.roles-permissions.destroy');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/pos', [POSController::class, 'index'])->name('web.pos.index');
});

require __DIR__.'/auth.php';
