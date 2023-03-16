<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promocode extends Model
{
    protected $fillable = [
        'store_id',
        'code',
        'title',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'discount',
        'discount_type',
        'max_discount',
        'min_purchase',
        'limit',
        'total_used',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
