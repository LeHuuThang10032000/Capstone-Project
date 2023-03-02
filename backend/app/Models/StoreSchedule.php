<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreSchedule extends Model
{
    protected $fillable = [
        'day',
        'store_id',
    ];

    protected $casts = [
        'day'=>'integer',
        'store_id'=>'integer',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
