<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'barcode',
        'sku',
        'category',
        'selling_price',
        'cost_price',
        'current_stock',
        'min_stock',
        'unit',
        'description',
    ];
}
