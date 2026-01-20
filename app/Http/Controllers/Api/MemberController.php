<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Member::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:members',
            'phone' => 'nullable|string|max:255|unique:members',
            'member_code' => 'required|string|max:255|unique:members',
            'join_date' => 'required|date',
            'status' => 'string',
            'notes' => 'nullable|string',
        ]);

        $member = Member::create($validatedData);

        return $member;
    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member)
    {
        return $member;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Member $member)
    {
        $validatedData = $request->validate([
            'name' => 'string|max:255',
            'email' => 'nullable|string|email|max:255|unique:members,email,' . $member->id,
            'phone' => 'nullable|string|max:255|unique:members,phone,' . $member->id,
            'member_code' => 'string|max:255|unique:members,member_code,' . $member->id,
            'join_date' => 'date',
            'status' => 'string',
            'notes' => 'nullable|string',
        ]);

        $member->update($validatedData);

        return $member;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member)
    {
        $member->delete();

        return response()->noContent();
    }
}
