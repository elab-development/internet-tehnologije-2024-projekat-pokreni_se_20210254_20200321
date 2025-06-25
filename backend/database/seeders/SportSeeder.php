<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sport;

class SportSeeder extends Seeder
{
    public function run()
    {
        Sport::insert([
            ['name' => 'Fudbal'],
            ['name' => 'Košarka'],
            ['name' => 'Tenis'],
            ['name' => 'Odbojka'],
        ]);
    }
}
