<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\DbColumn;
use App\Models\DbRow;
use App\Models\UserDatabase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DatabaseController extends Controller
{
    // ── Databases ─────────────────────────────────────────────────────────────

    public function index(): JsonResponse
    {
        $dbs = UserDatabase::where('user_id', auth()->id())
            ->withCount('rows')
            ->latest()
            ->get()
            ->map(fn($db) => [
                'id'          => $db->id,
                'name'        => $db->name,
                'type'        => $db->type,
                'rows_count'  => $db->rows_count,
                'share_token' => $db->share_token,
                'share_alias' => $db->share_alias,
                'form_color'  => $db->form_color,
                'form_icon'   => $db->form_icon,
                'form_logo'   => $db->form_logo,
                'created_at'  => $db->created_at->format('d M Y'),
            ]);

        return response()->json($dbs);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|string|max:20',
        ]);

        $db = UserDatabase::create([
            'user_id' => auth()->id(),
            'name'    => $request->name,
            'type'    => $request->type,
        ]);

        return response()->json([
            'id'         => $db->id,
            'name'       => $db->name,
            'type'       => $db->type,
            'rows_count' => 0,
            'created_at' => $db->created_at->format('d M Y'),
        ], 201);
    }

    public function destroy(UserDatabase $userDatabase): JsonResponse
    {
        abort_if($userDatabase->user_id !== auth()->id(), 403);
        $userDatabase->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // ── Columns ───────────────────────────────────────────────────────────────

    public function data(UserDatabase $userDatabase): JsonResponse
    {
        abort_if($userDatabase->user_id !== auth()->id(), 403);

        $cols = $userDatabase->columns->map(fn($c) => [
            'id'           => $c->id,
            'col_key'      => $c->col_key,
            'label'        => $c->label,
            'type'         => $c->type,
            'options'      => $c->options ?? [],
            'sort_order'   => $c->sort_order,
            'show_in_form' => (bool) $c->show_in_form,
        ]);

        $userName = auth()->user()->name;
        $rows = $userDatabase->rows->map(fn($r) => array_merge(
            [
                'id'             => $r->id,
                'last_edited_by' => $r->last_edited_by ?? $userName,
                'updated_at'     => $r->updated_at?->toISOString(),
            ],
            $r->data ?? [],
        ));

        return response()->json(compact('cols', 'rows'));
    }

    public function updateFormStyle(Request $request, UserDatabase $userDatabase): JsonResponse
    {
        abort_if($userDatabase->user_id !== auth()->id(), 403);
        $request->validate([
            'form_color' => 'nullable|string|max:80',
            'form_icon'  => 'nullable|string|max:20',
        ]);
        $userDatabase->update($request->only(['form_color', 'form_icon']));
        return response()->json([
            'form_color' => $userDatabase->form_color,
            'form_icon'  => $userDatabase->form_icon,
        ]);
    }

    public function uploadFormLogo(Request $request, UserDatabase $userDatabase): JsonResponse
    {
        abort_if($userDatabase->user_id !== auth()->id(), 403);
        $request->validate(['file' => 'required|image|max:2048']);

        $dir = public_path('form-logos');
        if (! is_dir($dir)) mkdir($dir, 0755, true);

        // Delete old logo file if exists
        if ($userDatabase->form_logo) {
            $old = public_path(parse_url($userDatabase->form_logo, PHP_URL_PATH));
            if (file_exists($old)) @unlink($old);
        }

        $ext      = $request->file('file')->extension();
        $filename = 'logo-' . $userDatabase->id . '-' . uniqid() . '.' . $ext;
        $request->file('file')->move($dir, $filename);

        $url = url("form-logos/{$filename}");
        $userDatabase->update(['form_logo' => $url]);

        return response()->json(['form_logo' => $url]);
    }

    public function deleteFormLogo(UserDatabase $userDatabase): JsonResponse
    {
        abort_if($userDatabase->user_id !== auth()->id(), 403);

        if ($userDatabase->form_logo) {
            $path = public_path(parse_url($userDatabase->form_logo, PHP_URL_PATH));
            if (file_exists($path)) @unlink($path);
        }

        $userDatabase->update(['form_logo' => null]);
        return response()->json(['form_logo' => null]);
    }

    public function addColumn(Request $request, UserDatabase $userDatabase): JsonResponse
    {
        abort_if($userDatabase->user_id !== auth()->id(), 403);

        $request->validate([
            'label'   => 'required|string|max:100',
            'type'    => 'required|string|max:30',
            'options' => 'nullable|array',
        ]);

        $maxOrder = $userDatabase->columns()->max('sort_order') ?? 0;
        $colKey   = 'col_' . Str::random(8);

        $col = DbColumn::create([
            'database_id'  => $userDatabase->id,
            'col_key'      => $colKey,
            'label'        => $request->label,
            'type'         => $request->type,
            'options'      => $request->options ?? [],
            'sort_order'   => $maxOrder + 1,
            'show_in_form' => $request->boolean('show_in_form', true),
        ]);

        return response()->json([
            'id'           => $col->id,
            'col_key'      => $col->col_key,
            'label'        => $col->label,
            'type'         => $col->type,
            'options'      => $col->options ?? [],
            'sort_order'   => $col->sort_order,
            'show_in_form' => (bool) $col->show_in_form,
        ], 201);
    }

    public function updateColumn(Request $request, UserDatabase $userDatabase, DbColumn $dbColumn): JsonResponse
    {
        abort_if($userDatabase->user_id !== auth()->id(), 403);
        abort_if($dbColumn->database_id !== $userDatabase->id, 404);

        $data = $request->validate([
            'label'        => 'sometimes|string|max:100',
            'show_in_form' => 'sometimes|boolean',
            'options'      => 'sometimes|array',
        ]);

        $dbColumn->update($data);

        return response()->json([
            'id'           => $dbColumn->id,
            'col_key'      => $dbColumn->col_key,
            'label'        => $dbColumn->label,
            'type'         => $dbColumn->type,
            'options'      => $dbColumn->options ?? [],
            'sort_order'   => $dbColumn->sort_order,
            'show_in_form' => (bool) $dbColumn->show_in_form,
        ]);
    }

    public function deleteColumn(UserDatabase $userDatabase, DbColumn $dbColumn): JsonResponse
    {
        abort_if($userDatabase->user_id !== auth()->id(), 403);
        abort_if($dbColumn->database_id !== $userDatabase->id, 404);

        // Remove this col's data from all rows
        $colKey = $dbColumn->col_key;
        $userDatabase->rows->each(function ($row) use ($colKey) {
            $data = $row->data ?? [];
            unset($data[$colKey]);
            $row->update(['data' => $data]);
        });

        $dbColumn->delete();
        return response()->json(['message' => 'Column deleted']);
    }

    // ── Rows ──────────────────────────────────────────────────────────────────

    public function addRow(UserDatabase $userDatabase): JsonResponse
    {
        abort_if($userDatabase->user_id !== auth()->id(), 403);

        $maxOrder = $userDatabase->rows()->max('sort_order') ?? 0;
        $blank    = [];
        foreach ($userDatabase->columns as $col) {
            $blank[$col->col_key] = null;
        }

        $row = DbRow::create([
            'database_id'    => $userDatabase->id,
            'data'           => $blank,
            'sort_order'     => $maxOrder + 1,
            'last_edited_by' => auth()->user()->name,
        ]);

        return response()->json(array_merge([
            'id'             => $row->id,
            'last_edited_by' => $row->last_edited_by,
            'updated_at'     => $row->updated_at?->toISOString(),
        ], $row->data ?? []), 201);
    }

    public function updateRow(Request $request, UserDatabase $userDatabase, DbRow $dbRow): JsonResponse
    {
        abort_if($userDatabase->user_id !== auth()->id(), 403);
        abort_if($dbRow->database_id !== $userDatabase->id, 404);

        $request->validate(['data' => 'required|array']);

        $current = $dbRow->data ?? [];
        $merged  = array_merge($current, $request->data);
        $dbRow->update([
            'data'           => $merged,
            'last_edited_by' => auth()->user()->name,
        ]);

        return response()->json(array_merge([
            'id'             => $dbRow->id,
            'last_edited_by' => $dbRow->last_edited_by,
            'updated_at'     => $dbRow->updated_at?->toISOString(),
        ], $dbRow->data));
    }

    public function uploadImage(Request $request, UserDatabase $userDatabase): JsonResponse
    {
        abort_if($userDatabase->user_id !== auth()->id(), 403);
        $request->validate(['file' => 'required|image|max:5120']);

        $dir  = public_path('db-images');
        if (! is_dir($dir)) mkdir($dir, 0755, true);

        $filename = 'db-' . $userDatabase->id . '-' . uniqid() . '.' . $request->file('file')->getClientOriginalExtension();
        $request->file('file')->move($dir, $filename);

        return response()->json(['url' => url("db-images/{$filename}")]);
    }

    public function deleteRow(UserDatabase $userDatabase, DbRow $dbRow): JsonResponse
    {
        abort_if($userDatabase->user_id !== auth()->id(), 403);
        abort_if($dbRow->database_id !== $userDatabase->id, 404);

        $dbRow->delete();
        return response()->json(['message' => 'Row deleted']);
    }
}
