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

    protected $appends = ['product_quantity'];

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

    public function getProductDetailAttribute($value)
    {
        $products = json_decode($value, true);
        return $products;
    }

    public function getProductQuantityAttribute()
    {
        $quantity = 0;
        $products = $this->product_detail;
        if(isset($products)) {
            foreach($products as $product) {
                $quantity += $product['quantity'];
            }
        }
        
        return $products;
    }
}
