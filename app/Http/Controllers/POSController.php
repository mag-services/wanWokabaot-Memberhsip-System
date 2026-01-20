<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class POSController extends Controller
{
    public function index(): Response
    {
        $products = Product::select('id', 'name', 'selling_price', 'current_stock')->where('current_stock', '>', 0)->get();

        return Inertia::render('POS/Index', [
            'products' => $products,
        ]);
    }
}
