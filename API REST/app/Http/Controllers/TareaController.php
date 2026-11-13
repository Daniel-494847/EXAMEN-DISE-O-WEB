<?php

namespace App\Http\Controllers;

use App\Models\Tarea;
use Illuminate\Http\Request;

class TareaController extends Controller
{
    /**
     * GET /api/tareas
     * Devuelve la lista de todas las tareas.
     */
    public function index()
    {
        $tareas = Tarea::all();

        return response()->json($tareas);
    }

    /**
     * POST /api/tareas
     * Registra una nueva tarea.
     */
    public function store(Request $request)
    {
        $datos = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'estado' => 'nullable|string|max:50',
        ]);

        $tarea = Tarea::create($datos);

        return response()->json($tarea, 201);
    }

    /**
     * GET /api/tareas/{id}
     * Muestra una tarea.
     */
    public function show($id)
    {
        $tarea = Tarea::find($id);

        if (! $tarea) {
            return response()->json(['mensaje' => 'Tarea no encontrada'], 404);
        }

        return response()->json($tarea);
    }

    /**
     * PUT /api/tareas/{id}
     * Actualiza una tarea.
     */
    public function update(Request $request, $id)
    {
        $tarea = Tarea::find($id);

        if (! $tarea) {
            return response()->json(['mensaje' => 'Tarea no encontrada'], 404);
        }

        $datos = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'estado' => 'nullable|string|max:50',
        ]);

        $tarea->update($datos);

        return response()->json($tarea);
    }

    /**
     * DELETE /api/tareas/{id}
     * Elimina una tarea.
     */
    public function destroy($id)
    {
        $tarea = Tarea::find($id);

        if (! $tarea) {
            return response()->json(['mensaje' => 'Tarea no encontrada'], 404);
        }

        $tarea->delete();

        return response()->json(['mensaje' => 'Tarea eliminada']);
    }
}
