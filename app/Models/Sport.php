<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sport extends Model
{
    //
    use HasFactory;

    
    protected $fillable = [
        'name',
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

   
    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
