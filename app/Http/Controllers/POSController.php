<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class POSController extends Controller
{
    public function index(): Response
    {
        $products = Product::select('id', 'name', 'selling_price', 'current_stock')->where('current_stock', '>', 0)->get();
        $members = Member::select('id', 'name', 'balance')->get();

        return Inertia::render('POS/Index', [
            'products' => $products,
            'members' => $members,
        ]);
    }

    public function processSale(Request $request): RedirectResponse
    {
        $request->validate([
            'member_id' => ['nullable', 'exists:members,id'],
            'cart' => ['required', 'array'],
            'cart.*.id' => ['required', 'exists:products,id'],
            'cart.*.quantity' => ['required', 'integer', 'min:1'],
            'total' => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'string'],
        ]);

        $total = $request->input('total');
        $memberId = $request->input('member_id');

        if ($memberId) {
            $member = Member::find($memberId);
            if ($member->balance >= 2000) {
                return back()->with('error', 'Member cannot purchase: unpaid amount is 2000vt or more.');
            }
            // Deduct from balance (simplified for now, full logic would involve orders/invoices)
            $member->balance += $total;
            $member->save();
        }

        // Simulate updating product stock (simplified)
        foreach ($request->input('cart') as $item) {
            $product = Product::find($item['id']);
            if ($product->current_stock < $item['quantity']) {
                return back()->with('error', 'Not enough stock for ' . $product->name);
            }
            $product->current_stock -= $item['quantity'];
            $product->save();
        }

        return back()->with('success', 'Sale processed successfully!');
    }
}

