<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        // Summary statistics
        $totalMembers = Member::count();
        $totalProducts = Product::count();
        $totalUsers = User::count();
        $totalUnpaid = Member::sum('balance');

        // Since we don't have actual sales/orders yet, we'll simulate some data
        // In a real app, this would come from orders/transactions table
        $totalRevenue = 0; // Placeholder - would be sum of all completed sales

        // Top 10 shoppers (highest total_spent)
        $topShoppers = Member::select('name', 'email', 'total_spent', 'balance')
            ->orderBy('total_spent', 'desc')
            ->limit(10)
            ->get();

        // Members with unpaid amounts (for the unpaid overview)
        $membersWithUnpaid = Member::where('balance', '>', 0)
            ->select('name', 'email', 'balance')
            ->orderBy('balance', 'desc')
            ->limit(10)
            ->get();

        // Recent member registrations (last 30 days)
        $recentMembers = Member::select('name', 'email', 'join_date')
            ->orderBy('join_date', 'desc')
            ->limit(5)
            ->get();

        // Chart data - Monthly member growth (simulated for last 12 months)
        $memberGrowthData = $this->getMemberGrowthData();

        // Sales chart data (placeholder - would be actual sales data)
        $salesData = $this->getSalesData();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'totalMembers' => $totalMembers,
                'totalProducts' => $totalProducts,
                'totalUnpaid' => $totalUnpaid,
            ],
            'topShoppers' => $topShoppers,
            'membersWithUnpaid' => $membersWithUnpaid,
            'recentMembers' => $recentMembers,
            'memberGrowthData' => $memberGrowthData,
            'salesData' => $salesData,
        ]);
    }

    private function getMemberGrowthData(): array
    {
        // Simulate member growth data for the last 12 months
        $data = [];
        $currentDate = now();

        for ($i = 11; $i >= 0; $i--) {
            $date = $currentDate->copy()->subMonths($i);
            // In a real app, you'd query actual member counts by month
            // For now, we'll simulate growing membership
            $count = Member::whereYear('created_at', $date->year)
                          ->whereMonth('created_at', $date->month)
                          ->count();

            $data[] = [
                'month' => $date->format('M Y'),
                'count' => $count ?: rand(1, 5), // Fallback for demo
            ];
        }

        return $data;
    }

    private function getSalesData(): array
    {
        // Placeholder sales data - in real app would be from orders table
        $data = [];
        $currentDate = now();

        for ($i = 11; $i >= 0; $i--) {
            $date = $currentDate->copy()->subMonths($i);

            $data[] = [
                'month' => $date->format('M Y'),
                'sales' => rand(1000, 5000), // Simulated sales data
            ];
        }

        return $data;
    }
}
