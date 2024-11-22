<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Nota;

    class NotaController extends Controller
{
    public function index(Request $request)
    {
        $notas = Nota::query();

        if ($request->has('actividad') && $request->actividad) {
            $notas = $notas->where('actividad', 'like', '%' . $request->actividad . '%');
        }

        if ($request->has('nota_min') && $request->has('nota_max')) {
            $notas = $notas->whereBetween('nota', [$request->nota_min, $request->nota_max]);
        }

        $notas = $notas->get();
        return response()->json(['data' => $notas], 200);
    }

        public function store(Request $request)
    {
        $validated = $request->validate([
            'actividad' => 'required|string|max:255',
            'nota' => 'required|numeric|between:0,5',
            'codEstudiante' => 'required|exists:estudiantes,cod',
        ]);

        $nota = Nota::create($validated);
        return response()->json(["data" => $nota], 201);
    }

    public function update(Request $request, $id)
    {
        $nota = Nota::find($id);
        if (!$nota) {
            return response()->json(['msg' => 'Nota no encontrada'], 404);
        }

        $validated = $request->validate([
            'actividad' => 'required|string|max:255',
            'nota' => 'required|numeric|between:0,5',
        ]);

        $nota->update($validated);
        return response()->json(['data' => $nota], 200);
    }


    public function destroy(Request $request, $id)
    {
        $nota = Nota::find($id);

        if (!$nota) {
            return response()->json(['msg' => 'Nota no encontrada'], 404);
        }

        if (!$request->has('confirm') || !$request->confirm) {
            return response()->json(['msg' => 'Se requiere confirmación para eliminar la nota'], 400);
        }

        $nota->delete();
        return response()->json(['msg' => 'Nota eliminada con éxito'], 200);
    }
    
}