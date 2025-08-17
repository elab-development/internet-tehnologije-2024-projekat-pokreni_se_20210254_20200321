<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeolocationService
{
    private $baseUrl = 'https://nominatim.openstreetmap.org';

    /**
     * Get coordinates (latitude, longitude) from an address
     */
    public function getCoordinates($address)
    {
        try {
            $response = Http::timeout(5)->withHeaders([
                'User-Agent' => 'SportEventApp/1.0'
            ])->get("{$this->baseUrl}/search", [
                'q' => $address,
                'format' => 'json',
                'limit' => 1,
                'addressdetails' => 1
            ]);

            if ($response->successful() && !empty($response->json())) {
                $data = $response->json()[0];
                
                return [
                    'latitude' => (float) $data['lat'],
                    'longitude' => (float) $data['lon'],
                    'display_name' => $data['display_name'],
                    'address' => $data['address'] ?? null
                ];
            }

            Log::warning('Geocoding API request failed', [
                'address' => $address,
                'response' => $response->body()
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('Geolocation service error', [
                'address' => $address,
                'error' => $e->getMessage()
            ]);

            return null;
        }
    }

    /**
     * Get address from coordinates (reverse geocoding)
     */
    public function getAddress($latitude, $longitude)
    {
        try {
            $response = Http::withHeaders([
                'User-Agent' => 'SportEventApp/1.0'
            ])->get("{$this->baseUrl}/reverse", [
                'lat' => $latitude,
                'lon' => $longitude,
                'format' => 'json',
                'addressdetails' => 1
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                return [
                    'display_name' => $data['display_name'],
                    'address' => $data['address'] ?? null
                ];
            }

            Log::warning('Reverse geocoding API request failed', [
                'latitude' => $latitude,
                'longitude' => $longitude,
                'response' => $response->body()
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('Reverse geolocation service error', [
                'latitude' => $latitude,
                'longitude' => $longitude,
                'error' => $e->getMessage()
            ]);

            return null;
        }
    }

    /**
     * Calculate distance between two coordinates in kilometers
     */
    public function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // Earth's radius in kilometers

        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($lonDelta / 2) * sin($lonDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Extract city and country from address
     */
    public function extractCityAndCountry($address)
    {
        $geocodeData = $this->getCoordinates($address);
        
        if ($geocodeData && isset($geocodeData['address'])) {
            $address = $geocodeData['address'];
            
            $city = $address['city'] ?? 
                   $address['town'] ?? 
                   $address['village'] ?? 
                   $address['municipality'] ?? 
                   null;
            
            $country = $address['country'] ?? null;
            
            return [
                'city' => $city,
                'country' => $country
            ];
        }

        return null;
    }
}
