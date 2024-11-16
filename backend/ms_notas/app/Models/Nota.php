<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nota extends Model
{
    protected $table = 'notas';
    public $timestamps = false;
    protected $fillable = ['id', 'actividad', 'nota', 'codEstudiante'];
}
