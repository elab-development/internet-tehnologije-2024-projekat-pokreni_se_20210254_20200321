<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class EventSummaryService
{
    private $huggingFaceApiKey;
    private $ollamaUrl;

    public function __construct()
    {
        $this->huggingFaceApiKey = config('services.huggingface.api_key');
        $this->ollamaUrl = config('services.ollama.url', 'http://localhost:11434');
    }

    /**
     * Generate event summary using available LLM services
     */
    public function generateEventSummary($event)
    {
        try {
            // Try Hugging Face API first (free tier available)
            if ($this->huggingFaceApiKey) {
                $summary = $this->generateWithHuggingFace($event);
                if ($summary) {
                    return $summary;
                }
            }

            // Try Ollama (local, free)
            $summary = $this->generateWithOllama($event);
            if ($summary) {
                return $summary;
            }

            // Fallback to template-based summary
            return $this->generateTemplateSummary($event);

        } catch (\Exception $e) {
            Log::error('Event summary generation failed', [
                'event_id' => $event->id,
                'error' => $e->getMessage()
            ]);

            return $this->generateTemplateSummary($event);
        }
    }

    /**
     * Generate summary using Hugging Face API
     */
    private function generateWithHuggingFace($event)
    {
        try {
            $prompt = $this->buildEventPrompt($event);
            
            $response = Http::timeout(30)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->huggingFaceApiKey,
                    'Content-Type' => 'application/json'
                ])
                ->post('https://api-inference.huggingface.co/models/gpt2', [
                    'inputs' => $prompt,
                    'parameters' => [
                        'max_length' => 150,
                        'temperature' => 0.8,
                        'do_sample' => true,
                        'top_p' => 0.9,
                        'repetition_penalty' => 1.1
                    ]
                ]);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data[0]['generated_text'])) {
                    return $this->cleanSummary($data[0]['generated_text']);
                }
            }

            return null;

        } catch (\Exception $e) {
            Log::warning('Hugging Face API failed', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Generate summary using Ollama (local)
     */
    private function generateWithOllama($event)
    {
        try {
            $prompt = $this->buildEventPrompt($event);
            
            $response = Http::timeout(30)
                ->post($this->ollamaUrl . '/api/generate', [
                    'model' => 'llama2',
                    'prompt' => $prompt,
                    'stream' => false,
                    'options' => [
                        'temperature' => 0.8,
                        'num_predict' => 150,
                        'top_p' => 0.9,
                        'repeat_penalty' => 1.1
                    ]
                ]);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['response'])) {
                    return $this->cleanSummary($data['response']);
                }
            }

            return null;

        } catch (\Exception $e) {
            Log::warning('Ollama API failed', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Generate template-based summary as fallback
     */
    private function generateTemplateSummary($event)
    {
        $sport = $event->sport->name ?? 'sport';
        $location = $event->location ?? 'specified location';
        $startTime = new \DateTime($event->start_time);
        $date = $startTime->format('F j, Y');
        $time = $startTime->format('g:i A');
        $participants = $event->participants_count ?? 0;
        $maxParticipants = $event->max_participants ?? 'unlimited';
        $organizer = $event->user->name ?? 'organizer';

        $summary = "🎯 Ready for some {$sport} action? Join us for an exciting event at {$location} on {$date} at {$time}! ";
        
        if ($maxParticipants !== 'unlimited') {
            $summary .= "Currently {$participants} out of {$maxParticipants} spots are filled - don't miss out! ";
        } else {
            $summary .= "Currently {$participants} participants have joined - be part of the fun! ";
        }

        if ($event->description) {
            $summary .= "Event highlights: " . substr($event->description, 0, 80);
            if (strlen($event->description) > 80) {
                $summary .= "...";
            }
        }

        $summary .= " Organized by {$organizer}. Come join the excitement!";

        return $summary;
    }

    /**
     * Build prompt for LLM
     */
    private function buildEventPrompt($event)
    {
        $sport = $event->sport->name ?? 'sport';
        $location = $event->location ?? 'location';
        $startTime = new \DateTime($event->start_time);
        $date = $startTime->format('F j, Y');
        $time = $startTime->format('g:i A');
        $description = $event->description ?? '';
        $participants = $event->participants_count ?? 0;
        $maxParticipants = $event->max_participants ?? 'unlimited';
        $organizer = $event->user->name ?? 'organizer';

        return "You are an expert event coordinator. Create a compelling, concise summary (max 150 words) for a sports event that will attract participants.

EVENT INFORMATION:
- Sport: {$sport}
- Location: {$location}
- Date: {$date}
- Time: {$time}
- Organizer: {$organizer}
- Current Participants: {$participants}" . ($maxParticipants !== 'unlimited' ? "/{$maxParticipants}" : "") . "
- Description: {$description}

INSTRUCTIONS:
- Write in an enthusiastic, welcoming tone
- Highlight the key benefits of joining
- Mention the sport, location, and timing clearly
- Include participant count if relevant
- Keep it engaging and action-oriented
- Use natural, conversational language

SUMMARY:";
    }

    /**
     * Clean and format the generated summary
     */
    private function cleanSummary($text)
    {
        // Remove extra whitespace and newlines
        $text = preg_replace('/\s+/', ' ', trim($text));
        
        // Remove any prompt remnants
        $text = preg_replace('/^(Summary:|Event details:|Location:|Date:|Time:|Participants:|Description:)/i', '', $text);
        
        // Ensure it's not too long
        if (strlen($text) > 300) {
            $text = substr($text, 0, 297) . '...';
        }

        return trim($text);
    }

    /**
     * Get cached summary or generate new one
     */
    public function getEventSummary($event)
    {
        $cacheKey = "event_summary_{$event->id}";
        
        return Cache::remember($cacheKey, 3600, function () use ($event) {
            return $this->generateEventSummary($event);
        });
    }
}
