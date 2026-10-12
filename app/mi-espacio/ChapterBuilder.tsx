"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "../../utils/supabase/database.types";
import StorySharing from "./StorySharing";

type Story = Database["public"]["Tables"]["stories"]["Row"];
type Chapter = Database["public"]["Tables"]["story_chapters"]["Row"];

type Props = {
  story: Story;
  user: User;
  supabase: SupabaseClient<Database>;
  onClose: () => void;
  notice: (message: string) => void;
};

const emptyDraft = (storyId: string, ownerId: string, order: number): Chapter => ({
  id: "",
  story_id: storyId,
  owner_id: ownerId,
  title: `Capítulo ${order + 1}`,
  content: "",
  chapter_order: order,
  period_label: null,
  location: null,
  created_at: "",
  updated_at: "",
});

export default function ChapterBuilder({ story, user, supabase, onClose, notice }: Props) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selected, setSelected] = useState<Chapter | null>(null);
  const [sharingOpen, setSharingOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const orderedChapters = useMemo(
    () => [...chapters].sort((a, b) => a.chapter_order - b.chapter_order),
    [chapters],
  );

  const loadChapters = useCallback(async () => {
    const { data, error } = await supabase
      .from("story_chapters")
      .select("*")
      .eq("story_id", story.id)
      .order("chapter_order", { ascending: true });
    if (error) notice("No hemos podido cargar los capítulos.");
    setChapters((data || []) as Chapter[]);
    setLoading(false);
  }, [notice, story.id, supabase]);

  useEffect(() => {
    // The state updates happen after the external Supabase request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadChapters();
  }, [loadChapters]);

  function createChapter() {
    setSelected(emptyDraft(story.id, user.id, orderedChapters.length));
  }

  async function saveChapter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || saving) return;
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "Capítulo").trim();
    const content = String(form.get("content") || "").trim();
    const periodLabel = String(form.get("period_label") || "").trim() || null;
    const location = String(form.get("location") || "").trim() || null;
    if (!title) return;

    setSaving(true);
    const payload = {
      title,
      content,
      period_label: periodLabel,
      location,
      updated_at: new Date().toISOString(),
    };
    const result = selected.id
      ? await supabase.from("story_chapters").update(payload).eq("id", selected.id)
      : await supabase.from("story_chapters").insert({
          ...payload,
          story_id: story.id,
          owner_id: user.id,
          chapter_order: orderedChapters.length,
        });

    if (result.error) {
      setSaving(false);
      notice("No hemos podido guardar el capítulo.");
      return;
    }

    const savedChapter = selected.id
      ? selected
      : (await supabase
          .from("story_chapters")
          .select("*")
          .eq("story_id", story.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()).data as Chapter | null;

    if (savedChapter) {
      await supabase.from("story_versions").insert({
        story_id: story.id,
        chapter_id: savedChapter.id,
        owner_id: user.id,
        title,
        content,
        change_reason: selected.id ? "Edición manual del capítulo" : "Creación del capítulo",
      });
    }

    setSaving(false);
    setSelected(null);
    await loadChapters();
    notice("Capítulo guardado");
  }

  async function deleteChapter(chapter: Chapter) {
    if (!confirm("¿Quieres eliminar este capítulo? Sus versiones también dejarán de estar disponibles.")) return;
    const { error } = await supabase.from("story_chapters").delete().eq("id", chapter.id);
    if (error) return notice("No hemos podido eliminar el capítulo.");
    setSelected(null);
    await loadChapters();
    notice("Capítulo eliminado");
  }

  return (
    <div className="modal-backdrop">
      <section className="chapter-modal" aria-labelledby="chapter-builder-title">
        <header className="modal-head">
          <div>
            <span>Constructor de historia</span>
            <h2 id="chapter-builder-title">{story.title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar constructor">×</button>
        </header>

        <div className="chapter-layout">
          <aside className="chapter-sidebar">
            <div className="chapter-sidebar-head">
              <div><p className="eyebrow">Tu recorrido</p><h3>Capítulos</h3></div>
              <div className="chapter-sidebar-actions"><button type="button" className="button button-soft" onClick={() => setSharingOpen(true)} aria-label="Gestionar personas autorizadas">♧</button><button type="button" className="button button-soft" onClick={createChapter} aria-label="Crear capítulo">＋</button></div>
            </div>
            {loading ? <p className="chapter-empty">Preparando tu historia…</p> : orderedChapters.length ? orderedChapters.map((chapter, index) => (
              <button
                type="button"
                className={`chapter-item ${selected?.id === chapter.id ? "active" : ""}`}
                key={chapter.id}
                onClick={() => setSelected(chapter)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{chapter.title}</strong>
                <small>{chapter.content ? `${chapter.content.slice(0, 46)}${chapter.content.length > 46 ? "…" : ""}` : "Todavía sin palabras"}</small>
              </button>
            )) : <p className="chapter-empty">Empieza dividiendo tu historia en una primera etapa.</p>}
          </aside>

          <div className="chapter-editor">
            {selected ? <form onSubmit={saveChapter}>
              <div className="chapter-editor-heading"><p className="eyebrow">{selected.id ? "Editar capítulo" : "Nuevo capítulo"}</p><h3>Cuenta esta parte a tu ritmo</h3></div>
              <label>Título<input name="title" defaultValue={selected.title} required /></label>
              <div className="chapter-fields"><label>Periodo o etapa<input name="period_label" defaultValue={selected.period_label || ""} placeholder="Por ejemplo, 1985–1992" /></label><label>Lugar<input name="location" defaultValue={selected.location || ""} placeholder="Un barrio, una ciudad…" /></label></div>
              <label>Texto del capítulo<textarea name="content" defaultValue={selected.content} rows={12} placeholder="Escribe lo que recuerdes. No tiene que estar perfecto." /></label>
              <p className="chapter-helper">Al guardar crearemos una versión para que puedas volver atrás y comparar tu historia con el tiempo.</p>
              <div className="modal-actions"><button type="button" onClick={() => setSelected(null)}>Cancelar</button>{selected.id && <button type="button" className="danger" onClick={() => deleteChapter(selected)}>Eliminar</button>}<button className="button button-primary" disabled={saving}>{saving ? "Guardando…" : "Guardar capítulo"}</button></div>
            </form> : <div className="chapter-placeholder"><span className="leaf">⌁</span><h3>Tu historia se construye paso a paso.</h3><p>Organiza tus recuerdos en capítulos para poder volver a ellos, ampliarlos y compartirlos con más calma.</p><button type="button" className="button button-primary" onClick={createChapter}>Crear mi primer capítulo</button><button type="button" className="button button-soft chapter-share-button" onClick={() => setSharingOpen(true)}>Gestionar personas autorizadas</button></div>}
          </div>
        </div>
      </section>
      {sharingOpen && <StorySharing story={story} user={user} supabase={supabase} onClose={() => setSharingOpen(false)} notice={notice} />}
    </div>
  );
}
