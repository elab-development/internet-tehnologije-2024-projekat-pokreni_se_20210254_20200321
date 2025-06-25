<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    public function run()
    {
        Event::insert([
            [
                'name' => 'Fudbalski turnir',
                'description' => 'Turnir lokalnih timova',
                'sport_id' => 1,
                'location' => 'Gradski stadion',
                'max_participants' => 22,
                'start_time' => Carbon::now()->addDays(7),
                'user_id' => 1,
            ],
            [
                'name' => 'Košarkaška utakmica',
                'description' => 'Prijateljski meč',
                'sport_id' => 2,
                'location' => 'Sportska hala',
                'max_participants' => 10,
                'start_time' => Carbon::now()->addDays(3),
                'user_id' => 2,
            ],
        ]);
    }
}
