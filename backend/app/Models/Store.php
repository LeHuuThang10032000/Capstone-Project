<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Store extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'email',
        'status',
        'selling_products',
        'location',
        'image',
        'wallet_balance',
        'cover_photo',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function categories()
    {
        return $this->hasMany(ProductCategory::class);
    }

    public function schedules()
    {
        return $this->hasMany(StoreSchedule::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function availablePromocodes()
    {
        return $this->hasMany(Promocode::class)->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->whereTime('start_time', '<=', now())
            ->whereTime('end_time', '>=', now())
            ->whereColumn('limit', '>=', 'total_used');
    }
    
    protected $hidden = [
        'created_at',
        'updated_at',
        'media'
    ];

    public function getImageAttribute()
    {
        $image = $this->getMedia('images')->first();
        if($image) {
            return $image->getFullUrl();
        }
        return null;
    }

    public function getCoverPhotoAttribute()
    {
        $image = $this->getMedia('cover_photos')->first();
        if($image) {
            return $image->getFullUrl();
        }
        return null;
    }
}
