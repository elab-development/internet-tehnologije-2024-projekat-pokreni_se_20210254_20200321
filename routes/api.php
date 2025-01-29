<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SportController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventParticipantController;
use App\Http\Controllers\AdminController;


// Registracija
Route::post('/register', [AuthController::class, 'register']);

// Prijava
Route::post('/login', [AuthController::class, 'login']);

// Odjava
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Pregled profila korisnika
Route::middleware('auth:sanctum')->get('/profile', [UserController::class, 'profile']);

// Pregled svih korisnika (admin)
Route::middleware(['auth:sanctum', 'admin'])->get('/users', [UserController::class, 'index']);

// Lista svih sportova
Route::get('/sports', [SportController::class, 'index']);

// Detalji jednog sporta
Route::get('/sports/{id}', [SportController::class, 'show']);

// Lista svih događaja
Route::get('/events', [EventController::class, 'index']);

// Kreiranje događaja
Route::middleware('auth:sanctum')->post('/events', [EventController::class, 'store']);

// Detalji događaja
Route::get('/events/{id}', [EventController::class, 'show']);

// Ažuriranje događaja
Route::middleware('auth:sanctum')->put('/events/{id}', [EventController::class, 'update']);

// Brisanje događaja
Route::middleware('auth:sanctum')->delete('/events/{id}', [EventController::class, 'destroy']);

// Prijavljivanje na događaj
Route::middleware('auth:sanctum')->post('/events/{id}/join', [EventParticipantController::class, 'store']);

// Odlazak sa događaja
Route::middleware('auth:sanctum')->delete('/events/{id}/leave', [EventParticipantController::class, 'destroy']);

// Lista učesnika za određeni događaj
Route::get('/events/{id}/participants', [EventParticipantController::class, 'index']);

// Rute za AdminController
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::get('/admin/users', [AdminController::class, 'getUsers']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);

    Route::post('/admin/events', [AdminController::class, 'createEvent']);
    Route::delete('/admin/events/{id}', [AdminController::class, 'deleteEvent']);

    Route::get('/admin/sports', [AdminController::class, 'getSports']);
    Route::post('/admin/sports', [AdminController::class, 'createSport']);
});


Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
});


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
