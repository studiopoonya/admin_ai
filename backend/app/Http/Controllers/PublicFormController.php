<?php

namespace App\Http\Controllers;

use App\Models\DbRow;
use App\Models\UserDatabase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PublicFormController extends Controller
{
    private function findBySlug(string $slug): UserDatabase
    {
        return UserDatabase::where('share_token', $slug)
            ->orWhere('share_alias', $slug)
            ->firstOrFail();
    }

    /** Return form config (columns + db name) for public rendering */
    public function show(string $token): JsonResponse
    {
        $db = $this->findBySlug($token);

        $cols = $db->columns
            ->where('show_in_form', true)
            ->values()
            ->map(fn($c) => [
                'id'       => $c->id,
                'col_key'  => $c->col_key,
                'label'    => $c->label,
                'type'     => $c->type,
                'options'  => $c->options ?? [],
            ]);

        return response()->json([
            'db_name'    => $db->name,
            'form_color' => $db->form_color,
            'form_icon'  => $db->form_icon,
            'form_logo'  => $db->form_logo,
            'cols'       => $cols,
        ]);
    }

    /** Submit a form entry (public, no auth) */
    public function submit(Request $request, string $token): JsonResponse
    {
        $db = $this->findBySlug($token);

        $request->validate(['data' => 'required|array']);

        $maxOrder = $db->rows()->max('sort_order') ?? 0;

        // Build blank row then merge submitted data
        $blank = [];
        foreach ($db->columns as $col) {
            $blank[$col->col_key] = null;
        }
        $merged = array_merge($blank, $request->data);

        DbRow::create([
            'database_id'    => $db->id,
            'data'           => $merged,
            'sort_order'     => $maxOrder + 1,
            'last_edited_by' => $request->input('submitted_by', 'Form publik'),
        ]);

        return response()->json(['message' => 'Berhasil dikirim'], 201);
    }

    /** Generate (or return existing) share token — authenticated owner only */
    public function generateToken(UserDatabase $userDatabase): JsonResponse
    {
        abort_if($userDatabase->user_id !== auth()->id(), 403);

        if (! $userDatabase->share_token) {
            $userDatabase->update(['share_token' => Str::random(32)]);
        }

        return response()->json(['share_token' => $userDatabase->share_token]);
    }

    /** Update custom alias */
    public function updateAlias(Request $request, UserDatabase $userDatabase): JsonResponse
    {
        abort_if($userDatabase->user_id !== auth()->id(), 403);

        $request->validate([
            'alias' => 'nullable|string|max:80|alpha_dash|unique:user_databases,share_alias,' . $userDatabase->id,
        ]);

        $userDatabase->update(['share_alias' => $request->alias ?: null]);
        return response()->json(['share_alias' => $userDatabase->share_alias]);
    }

    /** Revoke (delete) share token */
    public function revokeToken(UserDatabase $userDatabase): JsonResponse
    {
        abort_if($userDatabase->user_id !== auth()->id(), 403);
        $userDatabase->update(['share_token' => null]);
        return response()->json(['message' => 'Link dinonaktifkan']);
    }
}
