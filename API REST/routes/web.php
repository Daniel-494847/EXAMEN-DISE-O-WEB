<?php

use Illuminate\Support\Facades\Route;

// Interfaz web que consume la API de tareas
Route::get('/', function () {
    return view('tareas');
});
