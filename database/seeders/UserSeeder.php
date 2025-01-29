<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::insert([
            [
                'name' => 'Masha',
                'email' => 'masha@gmail.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ],
            [
                'name' => 'Lazar',
                'email' => 'lazar@gmail.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ],
            [
                'name' => 'Test User 1',
                'email' => 'user1@gmail.com',
                'password' => Hash::make('password'),
                'role' => 'registered_user',
            ],
        ]);
    }
}
