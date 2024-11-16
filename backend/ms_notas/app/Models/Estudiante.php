<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estudiante extends Model
{
    protected $table = 'estudiantes';
    protected $primaryKey = 'cod';
    public $timestamps = false;
    protected $fillable = ['cod', 'nombres', 'email'];
}
