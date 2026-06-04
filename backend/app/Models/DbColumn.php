<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DbColumn extends Model
{
    protected $table    = 'db_columns';
    protected $fillable = ['database_id', 'col_key', 'label', 'type', 'options', 'sort_order', 'show_in_form'];
    protected $casts    = ['options' => 'array', 'show_in_form' => 'boolean'];
}
