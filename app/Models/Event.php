<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

  
    protected $fillable = [
        'name',
        'description',
        'sport_id',
        'location',
        'max_participants',
        'start_time',
        'user_id',
    ];

    
    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    
    protected $casts = [
        'start_time' => 'datetime',
    ];

    
    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }

    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    
    public function participants()
{
    return $this->hasMany(EventParticipant::class, 'event_id');
}

}
