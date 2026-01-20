<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'manage-stock',
            'create-sale',
            'view-all-reports',
            'manage-members',
            'issue-refunds',
            'view-own-purchases',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $roles = [
            'Super Admin' => Permission::all()->pluck('name')->toArray(),
            'Treasurer/Admin' => [
                'manage-stock',
                'create-sale',
                'view-all-reports',
                'manage-members',
            ],
            'Cashier' => [
                'create-sale',
                'view-own-purchases',
            ],
            'Member' => ['view-own-purchases'],
            'Viewer' => ['view-all-reports'],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($rolePermissions);
        }
    }
}
