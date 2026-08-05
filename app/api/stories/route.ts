import { database, jsonError, requireApiUser } from "../_lib/data";

export async function GET() {
  try {
    const user = await requireApiUser();
    const result = await database().prepare("SELECT * FROM stories WHERE owner_id = ? ORDER BY updated_at DESC").bind(user.userId).all();
    return Response.json(result.results);
  } catch (error) { return jsonError(error); }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await request.json() as { title?: string; content?: string; prompt?: string };
    const id = crypto.randomUUID(); const now = Date.now();
    await database().prepare("INSERT INTO stories (id, owner_id, title, content, prompt, status, privacy, shared_with, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'draft', 'private', '[]', ?, ?)")
      .bind(id, user.userId, body.title?.trim() || "Historia sin título", body.content?.trim() || "", body.prompt || null, now, now).run();
    return Response.json({ id }, { status: 201 });
  } catch (error) { return jsonError(error); }
}
