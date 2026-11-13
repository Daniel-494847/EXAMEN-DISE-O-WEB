<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tarea extends Model
{
    /**
     * Campos que se pueden asignar de forma masiva.
     */
    protected $fillable = [
        'titulo',
        'descripcion',
        'estado',
    ];
}
