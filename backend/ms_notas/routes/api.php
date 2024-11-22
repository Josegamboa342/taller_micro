<?php

use App\Http\Controllers\EstudianteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotaController;
use App\Models\Nota;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
// En api.php





Route::post('/nota', function (Request $request) {
    $validated = $request->validate([
        'actividad' => 'required|string|max:255',
        'nota' => 'required|numeric|min:0|max:5',
    ]);

    $nota = Nota::create($validated);

    return response()->json($nota, 201);
});

Route::get('/notas', function () {
    $notas = Nota::all();
    return response()->json($notas);
});

Route::prefix('api')->group(function () {
    Route::get('/estudiantes', [EstudianteController::class, 'index']);
    Route::get('/estudiante/{cod}', [EstudianteController::class, 'show']);
    Route::post('/estudiantes', [EstudianteController::class, 'store']);
    Route::put('/estudiante/{id}', [EstudianteController::class, 'update']);
    Route::delete('/estudiante/{cod}', [EstudianteController::class, 'destroy']);

    Route::get('/notas', [NotaController::class, 'index']);
    Route::get('/nota/{id}', [NotaController::class, 'show']);
    Route::post('/notas', [NotaController::class, 'store']);
    Route::put('/nota/{id}', [NotaController::class, 'update']);
    Route::delete('/nota/{id}', [NotaController::class, 'destroy']);
});

Route::delete('nota/{id}', [NotaController::class, 'destroy']);

Route::get('notas', [NotaController::class, 'index']);

Route::prefix("pepito")->group(function () {
    Route::controller(EstudianteController::class)->group(function () {
        Route::get("estudiantes", "index");
        Route::delete("estudiante/{cod}", "destroy");
    });

    Route::controller(NotaController::class)->group(function () {
        Route::post("nota", "store");
    });
});

Route::prefix('pepito')->group(function () {
    Route::get('estudiantes', [EstudianteController::class, 'index']);
    Route::resource('nota', NotaController::class)->except(['create', 'edit']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix("pepito")->group(function () {
    Route::controller(EstudianteController::class)->group(function () {
        Route::get("estudiantes", "index");
        Route::get("estudiante/{cod}", "show");
        Route::post("estudiante", "store");
        Route::put("estudiante/{cod}", "update");
        Route::delete("estudiante/{cod}", "destroy");
    });

    Route::controller(NotaController::class)->group(function () {
        Route::get("notas", "index");
        Route::get("nota/{id}", "show");
        Route::post("nota", "store");
        Route::put("nota/{id}", "update");
        Route::delete("nota/{id}", "destroy"); 
    });
});
