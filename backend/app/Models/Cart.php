<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'add_ons',
        'quantity',
        'store_id',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function getAddOnsAttribute($value)
    {
        $addon = json_decode($value, true);
        $addon = AddOn::whereIn('id', $addon)->select('id', 'name', 'price')->get();
        return $addon;
    }
}
