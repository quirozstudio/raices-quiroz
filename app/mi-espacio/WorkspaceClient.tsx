"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { createClient } from "../../utils/supabase/client";
import type { Database } from "../../utils/supabase/database.types";
import ChapterBuilder from "./ChapterBuilder";
import LifeJourney from "./LifeJourney";
import { narrativePrompts } from "./narrative/questions";

type Story = Database["public"]["Tables"]["stories"]["Row"];
type Memory = Database["public"]["Tables"]["memories"]["Row"];
type Person = Database["public"]["Tables"]["people"]["Row"];
type View = "home" | "journey" | "stories" | "memories" | "people";

const prompts = narrativePrompts;

export default function WorkspaceClient() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [passwordConfirmationSent, setPasswordConfirmationSent] = useState(false);
  const [authMethod, setAuthMethod] = useState<"password" | "link">("password");
  const [registering, setRegistering] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [sending, setSending] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);
  const [view, setView] = useState<View>("home");
  const [stories, setStories] = useState<Story[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");
  const [editor, setEditor] = useState<Story | null>(null);
  const [chapterStory, setChapterStory] = useState<Story | null>(null);
  const [prompt, setPrompt] = useState(prompts[0]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [personOpen, setPersonOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const activeOwnerId = useRef<string | null>(null);
  const authStateKey = useRef<string | null | undefined>(undefined);

  const notice = useCallback((text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 4000);
  }, []);

  useEffect(() => {
    if (!retryAfter) return;
    const timer = window.setInterval(() => setRetryAfter((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [retryAfter]);

  const load = useCallback(async (ownerId: string) => {
    setBusy(true);
    const [storiesResult, memoriesResult, peopleResult] = await Promise.all([
      supabase.from("stories").select("*").eq("owner_id", ownerId).order("updated_at", { ascending: false }),
      supabase.from("memories").select("*").eq("owner_id", ownerId).order("created_at", { ascending: false }),
      supabase.from("people").select("*").eq("owner_id", ownerId).order("name"),
    ]);
    if (activeOwnerId.current !== ownerId) return;
    const error = storiesResult.error || memoriesResult.error || peopleResult.error;
    if (error) notice(error.message);
    setStories(storiesResult.data || []);
    setMemories(memoriesResult.data || []);
    setPeople(peopleResult.data || []);
    setBusy(false);
  }, [notice, supabase]);

  useEffect(() => {
    let mounted = true;
    const applySession = (nextUser: User | null) => {
      if (!mounted) return;
      const nextKey = nextUser?.id || null;
      if (authStateKey.current === nextKey) return;
      authStateKey.current = nextKey;
      activeOwnerId.current = nextKey;
      setUser(nextUser);
      if (!nextUser) setRecoveryMode(false);
      setEditor(null);
      setChapterStory(null);
      setStories([]);
      setMemories([]);
      setPeople([]);
      if (nextUser) void load(nextUser.id);
      else setBusy(false);
    };

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
      applySession(session?.user || null);
    });
    supabase.auth.getUser().then(({ data }) => {
      applySession(data.user);
    });
    return () => {
      mounted = false;
      activeOwnerId.current = null;
      data.subscription.unsubscribe();
    };
  }, [load, supabase]);

  async function sendLink(event: FormEvent) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setMessage("");
    const redirectTo = `${window.location.origin}/mi-espacio`;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    setSending(false);
    if (error) {
      const rateLimited = error.status === 429 || error.message.toLowerCase().includes("rate limit") || error.message.toLowerCase().includes("too many");
      if (rateLimited) {
        setRetryAfter(60);
        setMessage("El servicio ha limitado temporalmente los envíos. Puedes cambiar el correo ahora; si el límite es general, tendrás que esperar para solicitar otro enlace.");
      } else setMessage("No hemos podido enviar el enlace. Comprueba el correo e inténtalo de nuevo.");
      return;
    }
    setRetryAfter(0);
    setMessage("");
    setSent(true);
  }

  function resetAuthForm() {
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
    setMessage("");
    setSent(false);
    setPasswordConfirmationSent(false);
    setRetryAfter(0);
  }

  function switchAuthMethod(method: "password" | "link") {
    resetAuthForm();
    setAuthMethod(method);
  }

  async function submitPasswordAuth(event: FormEvent) {
    event.preventDefault();
    if (sending) return;
    if (password.length < 8) {
      setMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (registering && password !== passwordConfirmation) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }
    setSending(true);
    setMessage("");
    const redirectTo = `${window.location.origin}/mi-espacio`;
    const result = registering
      ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } })
      : await supabase.auth.signInWithPassword({ email, password });
    setSending(false);
    if (result.error) {
      const errorMessage = result.error.message.toLowerCase();
      if (errorMessage.includes("invalid login credentials")) setMessage("El correo o la contraseña no son correctos.");
      else if (errorMessage.includes("already registered") || errorMessage.includes("already exists")) setMessage("Esta cuenta ya existe. Entra con tu contraseña o recupera el acceso.");
      else setMessage("No hemos podido completar el acceso. Comprueba los datos e inténtalo de nuevo.");
      return;
    }
    setPassword("");
    setPasswordConfirmation("");
    if (registering && !result.data.session) {
      setPasswordConfirmationSent(true);
      return;
    }
  }

  async function sendPasswordReset() {
    if (!email || sending) {
      setMessage("Escribe primero tu correo electrónico.");
      return;
    }
    setSending(true);
    setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/mi-espacio` });
    setSending(false);
    if (error) {
      setMessage("No hemos podido enviar el enlace de recuperación. Espera unos minutos e inténtalo de nuevo.");
      return;
    }
    setPasswordConfirmationSent(true);
  }

  async function updateRecoveredPassword(event: FormEvent) {
    event.preventDefault();
    if (password.length < 8) return setMessage("La contraseña debe tener al menos 8 caracteres.");
    if (password !== passwordConfirmation) return setMessage("Las contraseñas no coinciden.");
    setSending(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSending(false);
    if (error) return setMessage("No hemos podido guardar la contraseña. Inténtalo de nuevo.");
    setRecoveryMode(false);
    setPassword("");
    setPasswordConfirmation("");
    setMessage("Contraseña guardada. Ya puedes entrar siempre con tu correo y contraseña.");
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("name") || "").trim();
    const gender = String(form.get("gender") || "");
    if (!fullName || !gender) return;
    const { data, error } = await supabase.auth.updateUser({ data: { full_name: fullName, gender } });
    if (error) return notice(error.message);
    setUser(data.user);
  }

  async function createStory(selectedPrompt?: string, title = "Historia sin título", content = "") {
    if (!user) return;
    const { data, error } = await supabase.from("stories").insert({ owner_id: user.id, title, prompt: selectedPrompt || null, content }).select().single();
    if (error) return notice(error.message);
    setEditor(data);
    await load(user.id);
  }

  async function saveStory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor || !user) return;
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title"));
    const content = String(form.get("content"));
    const { error } = await supabase.from("stories").update({ title: String(form.get("title")), content: String(form.get("content")), status: String(form.get("status")), privacy: String(form.get("privacy")), updated_at: new Date().toISOString() }).eq("id", editor.id).eq("owner_id", user.id);
    if (error) return notice(error.message);
    let versionWarning = false;
    const { error: versionError } = await supabase.from("story_versions").insert({ story_id: editor.id, owner_id: user.id, title, content, change_reason: "Edición manual de la historia" });
    versionWarning = Boolean(versionError);
    setEditor(null);
    if (user) await load(user.id);
    notice(versionWarning ? "Historia guardada, pero no hemos podido crear su copia de historial." : "Historia guardada con cariño");
  }

  async function deleteStory(id: string) {
    if (!user) return;
    if (!confirm("¿Quieres eliminar esta historia? Esta acción no se puede deshacer.")) return;
    const { error } = await supabase.from("stories").delete().eq("id", id).eq("owner_id", user.id);
    if (error) notice(error.message);
    else if (user) { await load(user.id); notice("Historia eliminada"); }
  }

  async function storeFile(file: File) {
    if (!user) return;
    if (file.size > 25 * 1024 * 1024) throw new Error("El archivo supera los 25 MB");
    const path = `${user.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const uploaded = await supabase.storage.from("memories").upload(path, file, { contentType: file.type, upsert: false });
    if (uploaded.error) throw uploaded.error;
    const saved = await supabase.from("memories").insert({ owner_id: user.id, name: file.name, object_path: path, mime_type: file.type || "application/octet-stream", size: file.size });
    if (saved.error) { await supabase.storage.from("memories").remove([path]); throw saved.error; }
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = new FormData(event.currentTarget).get("file");
    if (!(file instanceof File)) return;
    try { await storeFile(file); setUploadOpen(false); if (user) await load(user.id); notice("Recuerdo guardado de forma privada"); }
    catch (error) { notice(error instanceof Error ? error.message : "No se pudo guardar"); }
  }

  async function openMemory(item: Memory) {
    const { data, error } = await supabase.storage.from("memories").createSignedUrl(item.object_path, 60);
    if (error) notice(error.message); else window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function deleteMemory(item: Memory) {
    if (!user) return;
    if (!confirm("¿Eliminar este recuerdo?")) return;
    const removed = await supabase.storage.from("memories").remove([item.object_path]);
    if (removed.error) return notice(removed.error.message);
    await supabase.from("memories").delete().eq("id", item.id).eq("owner_id", user.id);
    await load(user.id);
  }

  async function addPerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const form = new FormData(event.currentTarget);
    const { error } = await supabase.from("people").insert({ owner_id: user.id, name: String(form.get("name")), email: String(form.get("email")).toLowerCase(), group_name: String(form.get("groupName")) });
    if (error) return notice(error.message);
    setPersonOpen(false);
    await load(user.id);
    notice("Persona añadida");
  }

  async function removePerson(id: string) {
    if (!user) return;
    const { error } = await supabase.from("people").delete().eq("id", id).eq("owner_id", user.id);
    if (error) notice(error.message); else await load(user.id);
  }

  async function toggleRecording() {
    if (recording) { recorder.current?.stop(); setRecording(false); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];
      const media = new MediaRecorder(stream);
      recorder.current = media;
      media.ondataavailable = (event) => chunks.current.push(event.data);
      media.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunks.current, { type: media.mimeType || "audio/webm" });
        try { await storeFile(new File([blob], `Mi voz ${new Date().toLocaleDateString("es-ES")}.webm`, { type: blob.type })); if (user) await load(user.id); notice("Grabación guardada"); }
        catch (error) { notice(error instanceof Error ? error.message : "No se pudo guardar"); }
      };
      media.start();
      setRecording(true);
    } catch { notice("Necesitamos permiso para usar el micrófono"); }
  }

  if (user === undefined) return <main className="auth-page"><div className="auth-card"><span className="leaf">⌁</span><p>Preparando tu espacio privado…</p></div></main>;

  if (recoveryMode && user) return <main className="auth-page"><section className="auth-card"><Link href="/" className="brand"><span className="leaf">⌁</span>Raíces</Link><p className="eyebrow">Recuperación segura</p><h1>Crea tu contraseña.</h1><p>Elige una contraseña personal para que puedas volver a tu espacio sin esperar otro enlace.</p><form onSubmit={updateRecoveredPassword}><label>Nueva contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required /></label><label>Repite la contraseña<input type="password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} autoComplete="new-password" minLength={8} required /></label><button className="button button-primary" type="submit" disabled={sending}>{sending ? "Guardando…" : "Guardar contraseña"}</button></form>{message && <div className="auth-message" role="alert">{message}</div>}</section></main>;

  if (!user) return <main className="auth-page"><section className="auth-card"><Link href="/" className="brand"><span className="leaf">⌁</span>Raíces</Link>{passwordConfirmationSent ? <><p className="eyebrow">Revisa tu correo</p><h1>Ya casi estás dentro.</h1><p>Te hemos enviado un enlace seguro para confirmar la cuenta o recuperar tu contraseña. Cuando lo abras, volverás directamente a Raíces.</p><button className="button button-soft" onClick={resetAuthForm}>Volver al acceso</button></> : sent ? <><p className="eyebrow">Revisa tu correo</p><h1>Tu enlace ya va de camino.</h1><p>Hemos enviado un acceso seguro a <strong>{email}</strong>. Puedes cerrar esta página y abrir el enlace desde tu correo.</p><button className="button button-soft" onClick={resetAuthForm}>Usar otro correo</button></> : <><div className="auth-methods" role="tablist" aria-label="Método de acceso"><button type="button" role="tab" aria-selected={authMethod === "password"} className={authMethod === "password" ? "active" : ""} onClick={() => switchAuthMethod("password")}>Correo y contraseña</button><button type="button" role="tab" aria-selected={authMethod === "link"} className={authMethod === "link" ? "active" : ""} onClick={() => switchAuthMethod("link")}>Enlace seguro</button></div>{authMethod === "password" ? <><p className="eyebrow">Tu espacio privado</p><h1>{registering ? "Crea tu espacio." : "Entra en tu espacio."}</h1><p>{registering ? "Crea una cuenta personal para guardar tus historias y recuerdos." : "Entra con tu correo y tu contraseña personal."}</p><form onSubmit={submitPasswordAuth}><label>Correo electrónico<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@correo.com" autoComplete="email" required disabled={sending} /></label><label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo 8 caracteres" autoComplete={registering ? "new-password" : "current-password"} minLength={8} required disabled={sending} /></label>{registering && <label>Repite la contraseña<input type="password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} autoComplete="new-password" minLength={8} required disabled={sending} /></label>}<button className="button button-primary" type="submit" disabled={sending}>{sending ? "Comprobando…" : registering ? "Crear mi cuenta" : "Entrar en mi espacio"}</button></form>{!registering && <button className="password-recovery" type="button" onClick={sendPasswordReset} disabled={sending}>He olvidado mi contraseña</button>}<p className="auth-switch">{registering ? "¿Ya tienes una cuenta?" : "¿Es tu primera vez?"}<button type="button" onClick={() => { setRegistering((value) => !value); setMessage(""); setPassword(""); setPasswordConfirmation(""); }}>{registering ? "Entrar" : "Crear una cuenta"}</button></p></> : <><p className="eyebrow">Acceso sin contraseña</p><h1>Entra con un enlace.</h1><p>Escribe tu correo y te enviaremos un acceso seguro. No necesitas recordar ninguna contraseña.</p><form onSubmit={sendLink}><label>Correo electrónico<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@correo.com" autoComplete="email" required disabled={sending} /></label><button className="button button-primary" type="submit" disabled={sending}>{sending ? "Enviando…" : "Enviarme un enlace seguro"}</button></form>{retryAfter > 0 && <div className="auth-cooldown" role="status"><span>Espera recomendada: {retryAfter}s</span><button type="button" onClick={() => { setRetryAfter(0); setEmail(""); setMessage(""); }}>Cambiar de correo ahora</button></div>}</>}{message && <div className="auth-message" role="alert">{message}</div>}</>}</section></main>;

  if (!user.user_metadata?.full_name?.trim() || !["female", "male", "other"].includes(user.user_metadata?.gender)) return <main className="auth-page"><section className="auth-card"><Link href="/" className="brand"><span className="leaf">⌁</span>Raíces</Link><p className="eyebrow">Antes de comenzar</p><h1>Queremos conocerte</h1><p>Tu nombre y la forma en que quieres que nos dirijamos a ti harán que cada bienvenida y cada pregunta se sientan realmente tuyas.</p><form onSubmit={saveProfile}><label>Tu nombre<input name="name" type="text" defaultValue={user.user_metadata?.full_name || ""} placeholder="Por ejemplo, Rocío" autoComplete="name" required /></label><label>¿Cómo quieres que nos dirijamos a ti?<select name="gender" defaultValue={user.user_metadata?.gender || ""} required><option value="" disabled>Elige una opción</option><option value="female">Mujer</option><option value="male">Hombre</option><option value="other">Otro / prefiero una bienvenida neutra</option></select></label><button className="button button-primary" type="submit">Entrar en mi espacio</button></form>{message && <div className="onboarding-message" role="status">{message}</div>}</section></main>;

  const firstName = user.user_metadata.full_name.trim().split(" ")[0];
  const gender = user.user_metadata.gender as "female" | "male" | "other";
  const welcome = gender === "female" ? "Bienvenida" : gender === "male" ? "Bienvenido" : "Te damos la bienvenida";
  const personalPrompt = `¿${firstName}, ${prompt.slice(1, 2).toLowerCase()}${prompt.slice(2)}`;
  const counts = { photos: memories.filter((item) => item.mime_type.startsWith("image/")).length, audios: memories.filter((item) => item.mime_type.startsWith("audio/")).length, docs: memories.filter((item) => !item.mime_type.startsWith("image/") && !item.mime_type.startsWith("audio/")).length };

  return <main className="workspace"><aside className="workspace-nav"><Link href="/" className="brand"><span className="leaf">⌁</span>Raíces</Link><nav aria-label="Tu espacio">{([['home', '⌂', 'Mi espacio'], ['journey', '✦', 'Mi recorrido'], ['stories', '◇', 'Mis historias'], ['memories', '▧', 'Caja de recuerdos'], ['people', '♧', 'Personas y grupos']] as [View, string, string][]).map(([id, icon, label]) => <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}>{icon} <span>{label}</span></button>)}</nav><div className="workspace-profile"><span>{firstName.charAt(0).toUpperCase()}</span><div><strong>{firstName}</strong><small>{user.email}</small></div></div></aside>
    <section className="workspace-main">{message && <div className="toast" role="status">{message}</div>}<header><div><p className="eyebrow">Tu espacio privado</p><h1>{view === "home" ? `${welcome}, ${firstName}.` : view === "journey" ? "Mi recorrido vital" : view === "stories" ? "Mis historias" : view === "memories" ? "Caja de recuerdos" : "Personas y grupos"}</h1><p>{view === "home" ? "¿Qué parte de tu vida te gustaría recordar hoy?" : view === "journey" ? "Un camino de preguntas para comprender, sentir y conservar tu historia." : view === "stories" ? "Escribe a tu ritmo y conserva siempre tu propia voz." : view === "memories" ? "Tus fotografías, cartas, documentos y audios, en un lugar seguro." : "Decide con quién compartir cada historia."}</p></div><button className="button button-soft" onClick={() => supabase.auth.signOut()}>Salir</button></header>
      {busy ? <div className="loading">Preparando tus recuerdos…</div> : view === "home" ? <><div className="quick-actions"><button className="journey-launch" onClick={() => setView("journey")}><span>✦</span><div><strong>Recorrer mi vida</strong><small>Test guiado, emociones y retrato final</small></div><b>→</b></button><button onClick={() => createStory()}><span>✎</span><div><strong>Escribir una historia</strong><small>Empieza en blanco o con preguntas</small></div><b>→</b></button><button className={recording ? "recording" : ""} onClick={toggleRecording}><span>◉</span><div><strong>{recording ? "Detener y guardar" : "Contarla con mi voz"}</strong><small>{recording ? "Estamos escuchando con respeto…" : "Graba tu recuerdo para conservarlo"}</small></div><b>{recording ? "■" : "→"}</b></button><button onClick={() => setUploadOpen(true)}><span>＋</span><div><strong>Añadir un recuerdo</strong><small>Guarda una foto, carta o audio</small></div><b>→</b></button></div><div className="workspace-grid"><section className="drafts"><div className="panel-title"><h2>Continúa donde lo dejaste</h2><button className="link-button" onClick={() => setView("stories")}>Ver todas</button></div>{stories.length ? stories.slice(0, 2).map((story) => <article key={story.id}><div className="draft-symbol">✦</div><div><span className="status">{story.status === "draft" ? "Borrador" : "Terminada"} · {story.privacy === "private" ? "Solo tú" : "Compartida"}</span><h3>{story.title}</h3><p>{story.content || "Tu historia está esperando sus primeras palabras."}</p></div><button onClick={() => setEditor(story)} aria-label={`Editar ${story.title}`}>→</button></article>) : <div className="empty-state">Todavía no hay historias.</div>}</section><aside className="gentle-prompt"><span>Una pregunta para hoy</span><h3>{personalPrompt}</h3><button onClick={() => createStory(personalPrompt)}>Responder a esta pregunta</button><button className="subtle" onClick={() => setPrompt(prompts[(prompts.indexOf(prompt) + 1) % prompts.length])}>Elegir otra pregunta</button></aside></div><section className="memory-box"><div className="panel-title"><div><p className="eyebrow">Tu archivo personal</p><h2>Caja de recuerdos</h2></div><button onClick={() => setUploadOpen(true)}>＋ Añadir recuerdo</button></div><div className="memory-items">{[[counts.photos, "Fotografías", "warm"], [counts.docs, "Documentos", "olive"], [counts.audios, "Audios", "clay"]].map(([count, label, cls]) => <button key={String(label)} className={`memory-item ${cls}`} onClick={() => setView("memories")}><span>{count}</span><small>{label}</small></button>)}<button className="memory-item empty" onClick={() => setUploadOpen(true)}><span>＋</span><small>Guardar algo nuevo</small></button></div></section></> : view === "journey" ? <LifeJourney user={user} firstName={firstName} supabase={supabase} onCreateStory={createStory} notice={notice} /> : view === "stories" ? <section className="collection"><div className="collection-actions"><button className="button button-primary" onClick={() => createStory()}>＋ Nueva historia</button></div>{stories.length ? <div className="story-list">{stories.map((story) => <article key={story.id}><div><span className="status">{story.status === "draft" ? "Borrador" : "Terminada"} · {story.privacy === "private" ? "Solo tú" : "Compartida"}</span><h2>{story.title}</h2><p>{story.content || story.prompt || "Sin contenido todavía"}</p></div><div><button onClick={() => setEditor(story)}>Editar</button><button onClick={() => setChapterStory(story)}>Capítulos</button><button className="danger" onClick={() => deleteStory(story.id)}>Eliminar</button></div></article>)}</div> : <div className="empty-state large">{firstName}, tu primera historia puede empezar con una sola frase.<button onClick={() => createStory()}>Comenzar ahora</button></div>}</section> : view === "memories" ? <section className="collection"><div className="collection-actions"><button className="button button-primary" onClick={() => setUploadOpen(true)}>＋ Añadir recuerdo</button></div>{memories.length ? <div className="files-grid">{memories.map((item) => <article key={item.id}><button className="file-open" onClick={() => openMemory(item)}><span>{item.mime_type.startsWith("image/") ? "▧" : item.mime_type.startsWith("audio/") ? "◉" : "▤"}</span><strong>{item.name}</strong><small>{(item.size / 1024 / 1024).toFixed(1)} MB</small></button><button onClick={() => deleteMemory(item)}>Eliminar</button></article>)}</div> : <div className="empty-state large">Aquí aparecerán tus recuerdos.<button onClick={() => setUploadOpen(true)}>Guardar mi primer recuerdo</button></div>}</section> : <section className="collection"><div className="collection-actions"><button className="button button-primary" onClick={() => setPersonOpen(true)}>＋ Añadir persona</button></div>{people.length ? <div className="people-list">{people.map((person) => <article key={person.id}><span>{person.name.charAt(0)}</span><div><strong>{person.name}</strong><small>{person.email} · {person.group_name}</small></div><button onClick={() => removePerson(person.id)}>Quitar</button></article>)}</div> : <div className="empty-state large">Añade personas de confianza. No verán nada hasta que las elijas en una historia.<button onClick={() => setPersonOpen(true)}>Añadir una persona</button></div>}</section>}</section>
    {chapterStory && <ChapterBuilder story={chapterStory} user={user} supabase={supabase} onClose={() => setChapterStory(null)} notice={notice} />}
    {editor && <div className="modal-backdrop writing-backdrop"><form className="editor-modal writing-studio" onSubmit={saveStory}><div className="modal-head"><div><span>{editor.prompt ? "Recuerdo guiado · Cuaderno 01" : "Nueva historia · Cuaderno 01"}</span><h2>{firstName}, escribe sin prisa</h2></div><button type="button" onClick={() => setEditor(null)} aria-label="Cerrar editor">×</button></div><div className="writing-ritual"><span><i /> Guardado en privado</span><span>Una página cada vez</span></div>{editor.prompt && <blockquote>{editor.prompt}</blockquote>}<label className="writing-title-label">Título<input name="title" defaultValue={editor.title} /></label><label className="writing-body-label">Tu historia<textarea name="content" defaultValue={editor.content} rows={12} /></label><div className="writing-help"><strong>Si te quedas en blanco</strong><span>¿Dónde ocurrió?</span><span>¿Quién estaba contigo?</span><span>¿Qué sentiste?</span><span>¿Qué aprendiste?</span></div><div className="editor-settings"><label>Estado<select name="status" defaultValue={editor.status}><option value="draft">Borrador</option><option value="published">Terminada</option></select></label><label>Privacidad<select name="privacy" defaultValue={editor.privacy}><option value="private">Solo yo</option><option value="people">Personas elegidas</option><option value="link">Enlace privado</option></select></label></div><div className="modal-actions"><button type="button" onClick={() => setEditor(null)}>Cerrar sin guardar</button><button className="button button-primary">Guardar en mi archivo <span>→</span></button></div></form></div>}
    {uploadOpen && <div className="modal-backdrop"><form className="small-modal" onSubmit={upload}><button className="modal-close" type="button" onClick={() => setUploadOpen(false)} aria-label="Cerrar">×</button><p className="eyebrow">Caja de recuerdos</p><h2>Guardar un recuerdo</h2><p>Fotografías, audios, vídeos o PDF de hasta 25 MB.</p><label className="dropzone">Seleccionar archivo<input name="file" type="file" accept="image/*,audio/*,video/*,.pdf" required /></label><button className="button button-primary">Guardar de forma privada</button></form></div>}
    {personOpen && <div className="modal-backdrop"><form className="small-modal" onSubmit={addPerson}><button className="modal-close" type="button" onClick={() => setPersonOpen(false)} aria-label="Cerrar">×</button><p className="eyebrow">Personas de confianza</p><h2>Añadir una persona</h2><label>Nombre<input name="name" required /></label><label>Correo<input name="email" type="email" required /></label><label>Grupo<select name="groupName"><option>Familia</option><option>Amigos</option><option>Otro</option></select></label><button className="button button-primary">Añadir persona</button></form></div>}
  </main>;
}
