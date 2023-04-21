<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class WithdrawRequest extends Model
{
    use HasFactory;

    protected $table = 'withdraw_request';

    protected $fillable = [
        'user_id',
        'status',
        'transaction_id',
        'deny_reason',
        'amount',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function getTransactionIdAttribute($value)
    {
        $value = Crypt::decryptString($value);
        return $value;
    }
}
