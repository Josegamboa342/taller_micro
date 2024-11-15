<?php

use App\Http\Controllers\EstudianteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotaController;

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
        Route::get("resumen", "resumen");
    });
});

Route::prefix("pepito")->group(function () {
    Route::controller(NotaController::class)->group(function () {
        Route::get("notas", "index");
        Route::get("nota/{id}", "show");
        Route::post("nota", "store");
        Route::put("nota/{cod}", "update");
        Route::delete("nota/{cod}", "destroy");
    });
});

