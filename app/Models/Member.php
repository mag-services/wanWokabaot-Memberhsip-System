<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'member_code',
        'join_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'total_spent' => 'decimal:2',
    ];

    /**
     * Placeholder accessor for unpaid amount per member.
     * Replace this with real logic once you have invoices\/orders.
     */
    public function getUnpaidTotalAttribute(): string
    {
        return '0.00';
    }
}
