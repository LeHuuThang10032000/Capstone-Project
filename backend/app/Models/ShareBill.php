<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class ShareBill extends Model
{
    protected $fillable = [
        'order_id',
        'shared_id',
        'amount',
        'payment_type',
        'status',
        'is_owner'
    ];

    protected $appends = ['shared_name'];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'id');
    }

    public function sharedUser()
    {
        return $this->belongsTo(User::class, 'shared_id', 'id');
    }

    public function getSharedNameAttribute()
    {
        return $this->sharedUser->f_name ?? null;
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
