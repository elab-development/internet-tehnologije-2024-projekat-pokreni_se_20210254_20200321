<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EventParticipant;

class EventParticipantSeeder extends Seeder
{
    public function run()
    {
        EventParticipant::insert([
            [
                'event_id' => 1,
                'user_id' => 2,
            ],
            [
                'event_id' => 1,
                'user_id' => 3,
            ],
            [
                'event_id' => 2,
                'user_id' => 2,
            ],
        ]);
    }
}

