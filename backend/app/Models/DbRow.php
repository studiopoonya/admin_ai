<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DbRow extends Model
{
    protected $table    = 'db_rows';
    protected $fillable = ['database_id', 'data', 'sort_order', 'last_edited_by'];
    protected $casts    = ['data' => 'array'];
}
