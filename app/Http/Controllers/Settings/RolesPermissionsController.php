<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RolesPermissionsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Settings/RolesPermissions', [
            'roles' => Role::with('permissions:id,name')
                ->orderBy('name')
                ->get()
                ->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                        'guard_name' => $role->guard_name,
                        'permissions' => $role->permissions->map(fn($p) => ['id' => $p->id, 'name' => $p->name]),
                    ];
                }),
            'permissions' => Permission::select('id', 'name', 'guard_name')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'permission_ids' => ['nullable', 'array'],
            'permission_ids.*' => ['exists:permissions,id'],
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        if (!empty($validated['permission_ids'])) {
            $role->syncPermissions($validated['permission_ids']);
        }

        return redirect()->route('settings.roles-permissions');
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name,'.$role->id],
            'permission_ids' => ['nullable', 'array'],
            'permission_ids.*' => ['exists:permissions,id'],
        ]);

        $role->update([
            'name' => $validated['name'],
        ]);

        if (isset($validated['permission_ids'])) {
            $role->syncPermissions($validated['permission_ids'] ?? []);
        }

        return redirect()->route('settings.roles-permissions');
    }

    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();

        return redirect()->route('settings.roles-permissions');
    }
}
