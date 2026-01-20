<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Member::query();

        // Handle sorting
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        // Validate sort column
        $allowedSortColumns = ['id', 'name', 'email', 'join_date', 'status', 'total_spent'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'id';
        }

        // Validate sort direction
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $members = $query->orderBy($sortBy, $sortDirection)->get();

        return Inertia::render('Members/Index', [
            'members' => $members,
            'sortBy' => $sortBy,
            'sortDirection' => $sortDirection,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:members,email'],
            'phone' => ['nullable', 'string', 'max:255', 'unique:members,phone'],
            'member_code' => ['nullable', 'string', 'max:255', 'unique:members,member_code'],
            'join_date' => ['required', 'date'],
            'status' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        Member::create($validated);

        return redirect()->route('web.members.index')
            ->with('success', 'Member added successfully.');
    }

    public function update(Request $request, Member $member): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:members,email,'.$member->id],
            'phone' => ['nullable', 'string', 'max:255', 'unique:members,phone,'.$member->id],
            'member_code' => ['nullable', 'string', 'max:255', 'unique:members,member_code,'.$member->id],
            'join_date' => ['required', 'date'],
            'status' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $member->update($validated);

        return redirect()->route('web.members.index')
            ->with('success', 'Member updated successfully.');
    }

    public function destroy(Member $member): RedirectResponse
    {
        $member->delete();

        return redirect()->route('web.members.index')
            ->with('success', 'Member deleted successfully.');
    }
}
