<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_code',
        'user_id',
        'store_id',
        'promocode_id',
        'order_total',
        'discount_amount',
        'status',
        'note',
        'product_detail',
        'created_at',
        'updated_at',
        'accepted_at',
        'canceld_at',

    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function promocode()
    {
        return $this->belongsTo(Promocode::class, 'promocode_id', 'id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'id');
    }

    public function transaction()
    {
        return $this->hasOne(Transaction::class);
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
