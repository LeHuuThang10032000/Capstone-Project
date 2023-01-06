<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $table = 'transactions';

    protected $fillable = 
    ["from_id" ,
    "to_id",
    "amount",
    "message",
    "code"];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
