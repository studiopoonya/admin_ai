<?php

namespace App\Services;

use App\Models\Kiosk;
use App\Models\Setting;
use GuzzleHttp\Client;

class WhatsAppService
{
    private Client $client;
    private string $token;

    public function __construct()
    {
        $this->token  = Setting::get('wa_access_token') ?: config('services.fonnte.token', '');
        $this->client = new Client(['base_uri' => 'https://api.fonnte.com', 'timeout' => 15]);
    }

    public static function forKiosk(Kiosk $kiosk): self
    {
        $instance        = new self();
        $instance->token = $kiosk->wa_access_token ?: $instance->token;
        return $instance;
    }

    public function sendText(string $to, string $message): void
    {
        $this->send(['target' => $to, 'message' => $message, 'delay' => $this->typingDelay($message)]);
    }

    public function sendImage(string $to, string $imageUrl, string $caption = ''): void
    {
        $this->send(['target' => $to, 'message' => $caption ?: ' ', 'url' => $imageUrl, 'delay' => 2]);
    }

    public function sendImageFile(string $to, string $filePath, string $caption = ''): void
    {
        $fh = fopen($filePath, 'r');
        try {
            $response = $this->client->post('/send', [
                'headers'   => ['Authorization' => $this->token],
                'multipart' => [
                    ['name' => 'target',  'contents' => $to],
                    ['name' => 'message', 'contents' => $caption ?: ' '],
                    ['name' => 'delay',   'contents' => '2'],
                    ['name' => 'file',    'contents' => $fh, 'filename' => basename($filePath)],
                ],
            ]);
        } finally {
            if (is_resource($fh)) fclose($fh);
        }

        $body = json_decode($response->getBody()->getContents(), true);
        logger()->info('Fonnte sendImageFile', [
            'http_status' => $response->getStatusCode(),
            'status'      => $body['status']  ?? null,
            'reason'      => $body['reason']  ?? null,
            'target'      => $to,
            'file'        => basename($filePath),
        ]);

        if (isset($body['status']) && $body['status'] === false) {
            throw new \RuntimeException('Fonnte file upload failed: ' . ($body['reason'] ?? 'unknown error'));
        }
    }

    public function sendDocument(string $to, string $filePath, string $filename, string $caption = ''): void
    {
        // Fonnte accepts public URL — derive it from the file path under public/
        $relativePath = str_replace(public_path(), '', $filePath);
        $fileUrl      = url(ltrim(str_replace('\\', '/', $relativePath), '/'));

        $this->send([
            'target'   => $to,
            'message'  => $caption ?: ' ',
            'url'      => $fileUrl,
            'filename' => $filename,
            'delay'    => 2,
        ]);
    }

    private function send(array $data): void
    {
        $response = $this->client->post('/send', [
            'headers'     => ['Authorization' => $this->token],
            'form_params' => $data,
        ]);

        $body = json_decode($response->getBody()->getContents(), true);
        if (isset($body['status']) && $body['status'] === false) {
            logger()->warning('Fonnte send failed', [
                'reason' => $body['reason'] ?? 'unknown',
                'target' => $data['target'] ?? null,
            ]);
        }
    }

    // Simulate realistic typing speed: ~1 sec per 3 words, min 2s, max 7s
    private function typingDelay(string $message): int
    {
        $words = str_word_count(strip_tags($message));
        return max(2, min((int) ceil($words / 3), 7));
    }
}
