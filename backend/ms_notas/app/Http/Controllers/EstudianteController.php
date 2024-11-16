<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Estudiante;
use App\Models\Nota;

class EstudianteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $estudiantes = Estudiante::all()->map(function ($estudiante) {
            $notas = Nota::where('codEstudiante', $estudiante->cod)->get();
            if ($notas->isEmpty()) {
                $estudiante->nota_definitiva = 'No hay nota';
                $estudiante->estado = 'No hay nota';
            } else {
                $promedio = $notas->avg('nota');
                $estudiante->nota_definitiva = round($promedio, 2);
                $estudiante->estado = $promedio >= 3.0 ? 'Aprobado' : 'Perdido';
            }
            return $estudiante;
        });

        $resumen = [
            'aprobados' => $estudiantes->where('estado', 'Aprobado')->count(),
            'perdidos' => $estudiantes->where('estado', 'Perdido')->count(),
            'sin_notas' => $estudiantes->where('estado', 'No hay nota')->count(),
        ];

        return response()->json([
            'data' => $estudiantes,
            'resumen' => $resumen,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       $dataBody = $request->all();
       $estudiante = new Estudiante();
       $estudiante->cod = $dataBody['cod'];
       $estudiante->nombres = $dataBody['nombres'];
       $estudiante->email = $dataBody['email'];
       $estudiante->save();
       $data = ["data" => $estudiante];
        return response()->json($data, 201);
 
    }

    /**
     * Display the specified resource.
     */
    public function show(string $cod)
    {
        $row = Estudiante::find($cod);
        if (empty($row)) {
            return response()->json(["msg" => "error"], 404);
        }
        $data = ["data" => $row];
        return response()->json($data, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $dataBody = $request->all();
        $estudiante = Estudiante::find($id);
        if (empty($estudiante)) {
            return response()->json(["msg" => "error"], 404);
        }
        $estudiante->cod = $dataBody['cod'];
        $estudiante->nombres = $dataBody['nombre'];
        $estudiante->email = $dataBody['email'];
        $estudiante->save();
        $data = ["data" => $estudiante];
        return response()->json($data, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $cod)
    {
        $row = Estudiante::find($cod);
        if (empty($row)) {
            return response()->json(["msg" => "error no existe ese código"], 404);
        }
        $notas = Nota::where('codEstudiante', $cod)->get();
        if (count($notas) > 0) {
            return response()->json(["msg" => "No se puede eliminar el estudiante porque tiene notas asociadas"], 400);
        }
        $row->delete();
        return response()->json(["data" => "Estudiante borrado"], 200);
    }

}
   