import { database, jsonError, requireApiUser } from "../../_lib/data";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser(); const { id } = await params;
    const body = await request.json() as { title?: string; content?: string; status?: string; privacy?: string; sharedWith?: string[] };
    const current = await database().prepare("SELECT * FROM stories WHERE id = ? AND owner_id = ?").bind(id, user.userId).first();
    if (!current) return Response.json({ error: "Historia no encontrada" }, { status: 404 });
    await database().prepare("UPDATE stories SET title = ?, content = ?, status = ?, privacy = ?, shared_with = ?, updated_at = ? WHERE id = ? AND owner_id = ?")
      .bind(body.title ?? current.title, body.content ?? current.content, body.status ?? current.status, body.privacy ?? current.privacy, JSON.stringify(body.sharedWith ?? JSON.parse(String(current.shared_with || "[]"))), Date.now(), id, user.userId).run();
    return Response.json({ ok: true });
  } catch (error) { return jsonError(error); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const user = await requireApiUser(); const { id } = await params; await database().prepare("DELETE FROM stories WHERE id = ? AND owner_id = ?").bind(id, user.userId).run(); return Response.json({ ok: true }); }
  catch (error) { return jsonError(error); }
}
