<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditRequest extends Model
{

    protected $table = 'credit_requests';

    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'email',
        'status',
        'mssv',
        'reason',
        'transaction_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
