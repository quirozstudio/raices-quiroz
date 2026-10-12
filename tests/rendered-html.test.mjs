import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function renderHome() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Raíces public experience", async () => {
  const response = await renderHome();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Tu vida merece/);
  assert.match(html, /Privado desde el primer momento/);
  assert.match(html, /Recordar también es/);
  assert.match(html, /Tu historia no pertenece a internet/);
  assert.match(html, /Raíces — Tu vida merece ser contada/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|codex-preview/);
});

test("keeps the narrative and chapter foundations present", async () => {
  const [journey, chapters, sharing, privateLayout, questions, client, types] = await Promise.all([
    readFile(new URL("app/mi-espacio/LifeJourney.tsx", root), "utf8"),
    readFile(new URL("app/mi-espacio/ChapterBuilder.tsx", root), "utf8"),
    readFile(new URL("app/mi-espacio/StorySharing.tsx", root), "utf8"),
    readFile(new URL("app/mi-espacio/layout.tsx", root), "utf8"),
    readFile(new URL("app/mi-espacio/narrative/questions.ts", root), "utf8"),
    readFile(new URL("app/mi-espacio/WorkspaceClient.tsx", root), "utf8"),
    readFile(new URL("utils/supabase/database.types.ts", root), "utf8"),
  ]);

  assert.match(journey, /life_journeys/);
  assert.match(journey, /Tu retrato vital/);
  assert.match(journey, /Saltar por ahora/);
  assert.match(chapters, /story_chapters/);
  assert.match(chapters, /story_versions/);
  assert.match(sharing, /story_access/);
  assert.match(privateLayout, /index: false/);
  assert.match(questions, /narrativeQuestionLibrary/);
  assert.match(questions, /legado/);
  assert.match(client, /ChapterBuilder/);
  assert.match(types, /story_chapters/);
  assert.match(types, /story_versions/);
});

test("includes the essential public visual assets", async () => {
  await Promise.all([
    access(new URL("public/raices-hero.png", root)),
    access(new URL("public/og.png", root)),
    access(new URL("public/favicon.svg", root)),
  ]);
});
