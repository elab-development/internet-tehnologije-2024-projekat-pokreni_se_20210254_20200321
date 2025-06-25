<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SportController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventParticipantController;
use App\Http\Controllers\AdminController;

// 🔹 Public Routes (Guests can only view/search events & sports)
Route::get('/events', [EventController::class, 'index']);  
Route::get('/events/search', [EventController::class, 'search']);  
Route::get('/sports', [SportController::class, 'index']);
Route::get('/sports/{id}', [SportController::class, 'show']);

// 🔹 Authentication Routes (Register, Login, Logout, Profile)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/profile', [AuthController::class, 'profile']);

// 🔹 Registered Users Routes (Create/Delete Own Events, Join Events)
Route::middleware(['auth:sanctum', 'is_registered_user'])->group(function () {
    Route::post('/events', [EventController::class, 'store']); 
    Route::delete('/events/{id}', [EventController::class, 'destroy']); 

    // 🔹 Event Participation
    Route::post('/events/{event}/participants', [EventParticipantController::class, 'store']);
    Route::delete('/events/{event}/participants/{participant}', [EventParticipantController::class, 'destroy']); 
    Route::get('/events/{event}/participants', [EventParticipantController::class, 'index']); 
});

// 🔹 Admin Routes (Manage Users, Events, Sports)
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    // 🔸 User Management
    Route::get('/admin/users', [AdminController::class, 'getUsers']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);

    // 🔸 Sports Management
    Route::post('/sports', [SportController::class, 'store']); 
    Route::put('/sports/{id}', [SportController::class, 'update']); 
    Route::delete('/sports/{id}', [SportController::class, 'destroy']); 

    // 🔸 Event Management (Admins Can Delete Any Event)
    Route::delete('/admin/events/{id}', [EventController::class, 'destroy']); 

    // 🔸 Admin Dashboard
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
});
