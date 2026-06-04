<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserDatabase extends Model
{
    protected $table    = 'user_databases';
    protected $fillable = ['user_id', 'name', 'type', 'share_token', 'share_alias', 'form_color', 'form_icon', 'form_logo'];

    public function columns(): HasMany
    {
        return $this->hasMany(DbColumn::class, 'database_id')->orderBy('sort_order');
    }

    public function rows(): HasMany
    {
        return $this->hasMany(DbRow::class, 'database_id')->orderBy('sort_order')->orderBy('id');
    }
}
