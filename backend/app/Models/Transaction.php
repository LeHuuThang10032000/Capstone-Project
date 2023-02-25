<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Transaction extends Model
{
    use HasFactory, SoftDeletes;

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
      "updated_at", "deleted_at"
    ];

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_id', 'id');
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'to_id', 'id');
    }

    public function details()
    {
        return $this->hasMany(TransactionDetail::class, 'transaction_id', 'id');
    }
    
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function getTitleAttribute($value) {
        if($this->type == 'T') {
            if($this->from_id == Auth::user()->id) {
                $recipient = $this->toUser()->selectRaw('f_name')->first();
                $value = 'Chuyển tiền tới ' . $recipient->f_name;
            } else {
                $sender = $this->fromUser()->selectRaw('f_name')->first();
                $value = 'Nhận tiền từ ' . $sender->f_name;
            }
        }
        return $value;
    }
}
