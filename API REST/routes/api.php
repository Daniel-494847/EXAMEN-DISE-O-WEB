<?php

use App\Http\Controllers\TareaController;
use Illuminate\Support\Facades\Route;

// Rutas de la API para administrar tareas
Route::get('/tareas', [TareaController::class, 'index']);
Route::post('/tareas', [TareaController::class, 'store']);
Route::get('/tareas/{id}', [TareaController::class, 'show']);
Route::put('/tareas/{id}', [TareaController::class, 'update']);
Route::delete('/tareas/{id}', [TareaController::class, 'destroy']);
