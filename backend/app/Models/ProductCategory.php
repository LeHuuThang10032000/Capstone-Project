<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductCategory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'store_id',
        'name',
        'order',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'id');
    }
    
    public function products()
    {
        return $this->hasMany(Product::class, 'category_id', 'id');
    }

    public function availableProducts()
    {
        return $this->hasMany(Product::class, 'category_id', 'id')->where('status', '!=', 'unavailable');
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
