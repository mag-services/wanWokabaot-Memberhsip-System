<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Product::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'barcode' => 'nullable|string|max:255|unique:products',
            'sku' => 'nullable|string|max:255|unique:products',
            'category' => 'nullable|string|max:255',
            'selling_price' => 'required|numeric',
            'cost_price' => 'nullable|numeric',
            'current_stock' => 'integer',
            'min_stock' => 'integer',
            'unit' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $product = Product::create($validatedData);

        return $product;
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return $product;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validatedData = $request->validate([
            'name' => 'string|max:255',
            'barcode' => 'nullable|string|max:255|unique:products,barcode,' . $product->id,
            'sku' => 'nullable|string|max:255|unique:products,sku,' . $product->id,
            'category' => 'nullable|string|max:255',
            'selling_price' => 'numeric',
            'cost_price' => 'nullable|numeric',
            'current_stock' => 'integer',
            'min_stock' => 'integer',
            'unit' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $product->update($validatedData);

        return $product;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->noContent();
    }
}
