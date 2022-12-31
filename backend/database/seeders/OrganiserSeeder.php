<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class OrganiserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $organiser = Role::where('name', 'organiser')->first();
        $user = User::where('phone', '0353909400')->first();
        if($user) {
            $user->assignRole($organiser->id);
        } else {
            $newUser = User::create([
                'f_name' => 'Organiser',
                'phone' => '0353909400',
                'password' => bcrypt('123456'),
                'status' => 'active'
            ]);
            $newUser->assignRole($organiser->id);
        }
    }
}
