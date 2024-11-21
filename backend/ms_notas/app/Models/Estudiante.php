<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estudiante extends Model
{
    protected $table = 'estudiantes';
    public $timestamps = false;
    protected $primaryKey = 'cod';
    //protected $fillable = ['cod', 'nombres', 'email'];

    public function notas()
    {
        return $this->hasMany(Nota::class, 'codEstudiante', 'cod');
    }
}