<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Friends extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'friend_id',
        'status'
    ];

    protected $hidden = [
      'created_at',
      'updated_at'
    ];

    public function users(){
        return $this->belongsToMany(User::class);
    }
}
