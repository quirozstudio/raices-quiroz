"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "../../utils/supabase/database.types";

type Story = Database["public"]["Tables"]["stories"]["Row"];
type Person = Database["public"]["Tables"]["people"]["Row"];

type Props = {
  story: Story;
  user: User;
  supabase: SupabaseClient<Database>;
  onClose: () => void;
  notice: (message: string) => void;
};

export default function StorySharing({ story, user, supabase, onClose, notice }: Props) {
  const [people, setPeople] = useState<Person[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const [peopleResult, accessResult] = await Promise.all([
        supabase.from("people").select("*").order("name"),
        supabase.from("story_access").select("person_id").eq("story_id", story.id),
      ]);
      if (!active) return;
      if (peopleResult.error || accessResult.error) notice("No hemos podido cargar los permisos.");
      setPeople(peopleResult.data || []);
      setSelected((accessResult.data || []).map((item) => item.person_id));
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [notice, story.id, supabase]);

  function togglePerson(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((personId) => personId !== id) : [...current, id]);
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    const removed = await supabase.from("story_access").delete().eq("story_id", story.id).eq("owner_id", user.id);
    if (removed.error) {
      setSaving(false);
      notice("No hemos podido actualizar los permisos.");
      return;
    }
    if (selected.length) {
      const inserted = await supabase.from("story_access").insert(selected.map((personId) => ({ story_id: story.id, person_id: personId, owner_id: user.id })));
      if (inserted.error) {
        setSaving(false);
        notice("No hemos podido guardar las personas elegidas.");
        return;
      }
    }
    const { error } = await supabase.from("stories").update({ privacy: selected.length ? "people" : "private" }).eq("id", story.id);
    setSaving(false);
    if (error) return notice("Las personas se guardaron, pero no se pudo actualizar la privacidad.");
    notice(selected.length ? "Historia compartida con las personas elegidas" : "Historia guardada como privada");
    onClose();
  }

  return <div className="modal-backdrop sharing-layer"><section className="small-modal sharing-modal" aria-labelledby="sharing-title">
    <button className="modal-close" type="button" onClick={onClose} aria-label="Cerrar">×</button>
    <p className="eyebrow">Privacidad de la historia</p>
    <h2 id="sharing-title">¿Quién puede leer «{story.title}»?</h2>
    <p className="sharing-intro">Tu historia sigue siendo privada hasta que guardes una selección. Las personas elegidas no podrán ver otras historias.</p>
    {loading ? <p className="chapter-empty">Preparando tus personas de confianza…</p> : people.length ? <div className="sharing-people">{people.map((person) => <label key={person.id} className={`sharing-person ${selected.includes(person.id) ? "selected" : ""}`}><input type="checkbox" checked={selected.includes(person.id)} onChange={() => togglePerson(person.id)} /><span className="sharing-avatar">{person.name.charAt(0).toUpperCase()}</span><span><strong>{person.name}</strong><small>{person.email} · {person.group_name}</small></span></label>)}</div> : <div className="sharing-empty">Primero añade personas de confianza desde tu espacio privado.</div>}
    <p className="sharing-note">El enlace público todavía no está activo. Así evitamos que una historia íntima pueda compartirse accidentalmente.</p>
    <div className="modal-actions"><button type="button" onClick={onClose}>Cancelar</button><button type="button" className="button button-primary" onClick={save} disabled={saving || loading}>{saving ? "Guardando…" : "Guardar privacidad"}</button></div>
  </section></div>;
}
