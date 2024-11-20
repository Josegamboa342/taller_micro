<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Nota;

    class NotaController extends Controller
{
    public function index()
    {
        $notas = Nota::all();
        return response()->json(['data' => $notas], 200);
    }

    public function store(Request $request)
    {
        $nota = Nota::create($request->all());
        return response()->json(["data" => $nota], 201);
    }

    public function show($id)
    {
        $nota = Nota::find($id);
        return $nota
            ? response()->json(['data' => $nota], 200)
            : response()->json(['msg' => 'Nota no encontrada'], 404);
    }

    public function update(Request $request, $id)
    {
        $nota = Nota::find($id);
        if (!$nota) return response()->json(['msg' => 'Nota no encontrada'], 404);

        $nota->update($request->all());
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

