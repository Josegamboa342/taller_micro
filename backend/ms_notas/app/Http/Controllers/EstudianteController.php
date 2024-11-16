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
    public function index(Request $request)
{
    $query = Estudiante::with('notas');

    // Filtros
    if ($request->has('codigo') && $request->codigo) {
        $query->where('cod', 'like', '%' . $request->codigo . '%');
    }
    if ($request->has('nombre') && $request->nombre) {
        $query->where('nombres', 'like', '%' . $request->nombre . '%');
    }
    if ($request->has('email') && $request->email) {
        $query->where('email', 'like', '%' . $request->email . '%');
    }
    if ($request->has('estado') && $request->estado) {
        $query->whereHas('notas', function ($q) use ($request) {
            $q->havingRaw('AVG(nota) ' . ($request->estado == 'Aprobado' ? '>=' : '<') . ' 3');
        });
    }
    if ($request->has('sin_notas') && $request->sin_notas) {
        $query->whereDoesntHave('notas');
    }
    if ($request->has('rango_min') && $request->has('rango_max')) {
        $query->whereHas('notas', function ($q) use ($request) {
            $q->havingRaw('AVG(nota) BETWEEN ? AND ?', [$request->rango_min, $request->rango_max]);
        });
    }

    $estudiantes = $query->get();

    // Transformar datos para incluir estado y promedio
    $data = $estudiantes->map(function ($estudiante) {
        $promedio = $estudiante->notas->avg('nota');
        $estado = is_null($promedio) ? 'Sin notas' : ($promedio >= 3 ? 'Aprobado' : 'Reprobado');

        return [
            'cod' => $estudiante->cod,
            'nombres' => $estudiante->nombres,
            'email' => $estudiante->email,
            'nota_definitiva' => is_null($promedio) ? 'No hay nota' : round($promedio, 2),
            'estado' => $estado,
        ];
    });

    $resumen = [
        'aprobados' => $data->where('estado', 'Aprobado')->count(),
        'reprobados' => $data->where('estado', 'Reprobado')->count(),
        'sin_notas' => $data->where('estado', 'Sin notas')->count(),
    ];

    return response()->json(['data' => $data, 'resumen' => $resumen], 200);
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
        $estudiante = Estudiante::find($cod);

        if (empty($estudiante)) {
            return response()->json(["msg" => "El estudiante no existe"], 404);
        }

        if ($estudiante->notas()->exists()) {
            return response()->json(["msg" => "No se puede eliminar el estudiante porque tiene notas registradas"], 400);
        }

        $estudiante->delete();
        return response()->json(["msg" => "Estudiante eliminado con éxito"], 200);
    }

}
   