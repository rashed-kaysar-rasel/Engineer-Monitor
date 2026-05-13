<?php

use App\Http\Controllers\DeveloperController;
use App\Http\Controllers\FeatureShipmentController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified', 'active-role'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('developers', DeveloperController::class)
        ->only(['index', 'store', 'update', 'destroy']);
    Route::resource('projects', ProjectController::class)
        ->only(['index', 'store', 'update', 'destroy']);
    Route::resource('feature-shipments', FeatureShipmentController::class)
        ->only(['index', 'store', 'update', 'destroy']);
    Route::resource('bugs', \App\Http\Controllers\BugController::class)
        ->only(['index', 'store', 'update', 'destroy']);
});

require __DIR__.'/settings.php';
