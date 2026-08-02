<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;

class DeployWebhookController extends Controller
{
    // GitHub push webhook — triggers the deploy script on the VPS itself,
    // avoiding inbound SSH from GitHub's runners (blocked by the host's network firewall).
    public function handle(Request $request): Response
    {
        $secret    = config('services.deploy_webhook.secret');
        $signature = $request->header('X-Hub-Signature-256', '');
        $payload   = $request->getContent();

        if (! $secret || ! $signature || ! hash_equals(
            'sha256=' . hash_hmac('sha256', $payload, $secret),
            $signature
        )) {
            abort(403, 'Invalid signature.');
        }

        $data = $request->json()->all();

        if (($data['ref'] ?? null) !== 'refs/heads/master') {
            return response('Ignored (not master).', 200);
        }

        $process = new Process(['sudo', '-n', '/usr/local/bin/deploy-wabot.sh']);
        $process->setTimeout(null);
        $process->disableOutput();
        $process->start();

        Log::info('Deploy webhook triggered', ['commit' => $data['after'] ?? null]);

        return response('Deploy started.', 202);
    }
}
