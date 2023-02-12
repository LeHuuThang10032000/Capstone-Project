<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use DateTimeInterface;

class Transaction extends Model
{
    use HasFactory;

    protected $table = 'transactions';

    protected $fillable = [
        "from_id",
        "to_id",
        "amount",
        "message",
        "code",
        "title",
        "created_at"
    ];

    protected $hidden = [
      "updated_at"
    ];

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_id', 'id');
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'to_id', 'id');
    }
    
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
