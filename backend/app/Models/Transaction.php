<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;

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
        "created_at",
        "order_id",
        "type",
        "share_id",
        "wallet_type"
    ];

    protected $hidden = [
      "updated_at", "deleted_at"
    ];

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_id', 'id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'id');
    }

    public function shareBill()
    {
        return $this->belongsTo(ShareBill::class, 'share_id', 'id');
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'to_id', 'id');
    }

    public function details()
    {
        return $this->hasMany(TransactionDetail::class, 'transaction_id', 'id');
    }

    public function fromDetail()
    {
        return $this->hasOne(TransactionDetail::class, 'transaction_id', 'id')->where('user_id', $this->from_id);
    }

    public function toDetail()
    {
        return $this->hasOne(TransactionDetail::class, 'transaction_id', 'id')->where('user_id', $this->to_id);
    }
    
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function getTitleAttribute($value)
    {
        if($this->type == 'T') {
            if($this->from_id == Auth::user()->id) {
                $recipient = $this->toUser()->selectRaw('f_name')->first();
                $value = 'Chuyển tiền tới ' . $recipient->f_name ?? 'Người dùng VLPay';
            } else {
                $sender = $this->fromUser()->selectRaw('f_name')->first();
                $value = 'Nhận tiền từ ' . $sender->f_name ?? 'Người dùng VLPay';
            }
        }
        return $value;
    }

    public function getAmountAttribute($value)
    {
        $value = Crypt::decryptString($value);
        return $value;
    }

    public function getCodeAttribute($value)
    {
        $value = Crypt::decryptString($value);
        return $value;
    }

    public function getMessageAttribute($value)
    {
        $value = Crypt::decryptString($value);
        return $value;
    }
}
