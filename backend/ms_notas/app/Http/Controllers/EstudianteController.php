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
        $rows = Estudiante::all();
        $data = ["data" => $rows];
        return response()->json($data, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $dataBody = $request->all();
        $estudiante = new Estudiante();
        $estudiante->cod = $dataBody['cod'];
        $estudiante->nombres = $dataBody['nombre'];
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

    /**
     * Resumen estudiantes: cuántos aprobaron, perdieron y están sin notas registradas.
     */
    public function resumen()
    {
        $estudiantes = Estudiante::all();

        $estudiantesAprobados = 0;
        $estudiantesPerdieron = 0;
        $estudiantesSinNotas = 0;

        foreach ($estudiantes as $estudiante) {
            $notas = Nota::where('codEstudiante', $estudiante->cod)->get();

            if ($notas->isEmpty()) {
                $estudiantesSinNotas++;
            } else {
                $notaTotal = $notas->avg('nota'); 

                if ($notaTotal >= 3.0) {
                    $estudiantesAprobados++;
                } else {
                    $estudiantesPerdieron++;
                }
            }
        }
        $data = [
            'estudiantesAprobados' => $estudiantesAprobados,
            'estudiantesPerdieron' => $estudiantesPerdieron,
            'estudiantesSinNotas' => $estudiantesSinNotas,
        ];

        return response()->json($data, 200);
    }
}
