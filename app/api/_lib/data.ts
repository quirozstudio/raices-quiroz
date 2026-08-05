import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

export async function requireApiUser() {
  const user = await getChatGPTUser();
  if (!user) throw new Response("No autorizado", { status: 401 });
  return user;
}

export function database() {
  if (!env.DB) throw new Response("Base de datos no disponible", { status: 503 });
  return env.DB;
}

export function memoryBucket() {
  if (!env.MEMORIES) throw new Response("Almacenamiento no disponible", { status: 503 });
  return env.MEMORIES;
}

export function jsonError(error: unknown) {
  if (error instanceof Response) return error;
  console.error(error);
  return Response.json({ error: "No se pudo completar la acción" }, { status: 500 });
}
