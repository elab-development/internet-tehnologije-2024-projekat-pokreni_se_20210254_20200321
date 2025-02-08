<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventParticipant extends Model
{
    use HasFactory;

    
    protected $fillable = [
        'event_id',
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
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
}
