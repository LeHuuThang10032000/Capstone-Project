<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model implements HasMedia
{
    use InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'store_id',
        'name',
        'price',
        'category_id',
        'status',
        'add_ons'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
        'media'
    ];

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'category_id', 'id');
    }

    public function getImageAttribute()
    {
        $image = $this->getMedia('images')->first();
        if($image) {
            return $image->getFullUrl();
        }
        return null;
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function getAddOnsAttribute()
    {
        
    }
}
