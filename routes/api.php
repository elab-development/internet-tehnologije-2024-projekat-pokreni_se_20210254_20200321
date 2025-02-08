<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SportController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventParticipantController;
use App\Http\Controllers\AdminController;


// 🔹 Public routes (Guests can only view/search events & sports)
Route::get('/events', [EventController::class, 'index']);  
Route::get('/events/search', [EventController::class, 'search']);  
Route::get('/sports', [SportController::class, 'index']);
Route::get('/sports/{id}', [SportController::class, 'show']);

// 🔹 Authentication routes (Register, Login, Logout, Profile)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/profile', [AuthController::class, 'profile']);


// 🔹 Routes for Registered Users (Create/Delete Their Own Events)
Route::middleware(['auth:sanctum', 'is_registered_user'])->group(function () {
    Route::post('/events', [EventController::class, 'store']); // ✅ Registered users can create events
    Route::delete('/events/{id}', [EventController::class, 'destroy']); // ✅ Registered users can delete their own events
    Route::post('/events/{event}/participants', [EventParticipantController::class, 'store']); // ✅ Registered users can join events
    Route::delete('/events/{event}/participants/{participant}', [EventParticipantController::class, 'destroy']); // ✅ Registered users can leave events
    Route::get('/events/{event}/participants', [EventParticipantController::class, 'index']); // ✅ Registered users can view event participants
});

// 🔹 Admin Routes (Manage Users, Events, Sports)
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    // 🔸 User management
    Route::get('/admin/users', [AdminController::class, 'getUsers']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);

    // 🔸 Sports management
    Route::post('/sports', [SportController::class, 'store']); 
    Route::put('/sports/{id}', [SportController::class, 'update']); 
    Route::delete('/sports/{id}', [SportController::class, 'destroy']); 

    // 🔸 Event management (Admins can delete any event)
    Route::delete('/events/{id}', [EventController::class, 'destroy']); 

    // 🔸 Dashboard
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
});