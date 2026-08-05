import Link from "next/link";
import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";

export const dynamic = "force-dynamic";

export default async function MiEspacio() {
  const user = await requireChatGPTUser("/mi-espacio");
  const name = user.fullName?.split(" ")[0] ?? "de nuevo";
  return (
    <main className="workspace">
      <aside className="workspace-nav">
        <Link href="/" className="brand"><span className="leaf">⌁</span>Raíces</Link>
        <nav>
          <a className="active" href="#inicio">⌂ <span>Mi espacio</span></a>
          <a href="#historias">◇ <span>Mis historias</span></a>
          <a href="#recuerdos">▧ <span>Caja de recuerdos</span></a>
          <a href="#personas">♧ <span>Personas y grupos</span></a>
        </nav>
        <div className="workspace-profile"><span>{name.charAt(0).toUpperCase()}</span><div><strong>{user.displayName}</strong><small>Espacio privado</small></div></div>
      </aside>
      <section className="workspace-main" id="inicio">
        <header><div><p className="eyebrow">Tu espacio privado</p><h1>Bienvenido, {name}.</h1><p>¿Qué recuerdo te gustaría guardar hoy?</p></div><a className="button button-soft" href={chatGPTSignOutPath("/")}>Salir</a></header>
        <div className="quick-actions">
          <button><span>✎</span><div><strong>Escribir una historia</strong><small>Empieza en blanco o con preguntas</small></div><b>→</b></button>
          <button><span>◉</span><div><strong>Contarla con mi voz</strong><small>Graba y convierte tu voz en un borrador</small></div><b>→</b></button>
          <button><span>＋</span><div><strong>Añadir un recuerdo</strong><small>Guarda una foto, carta o audio</small></div><b>→</b></button>
        </div>
        <div className="workspace-grid">
          <section className="drafts"><div className="panel-title"><h2>Continúa donde lo dejaste</h2><a href="#historias">Ver todas</a></div><article><div className="draft-image" /><div><span className="status">Borrador · Solo tú</span><h3>Los domingos en casa de los abuelos</h3><p>“Siempre recuerdo el olor del café y la puerta abierta al patio…”</p><small>Editado hace 2 días</small></div><button aria-label="Continuar historia">→</button></article></section>
          <aside className="gentle-prompt"><span>Una pregunta para hoy</span><h3>¿Qué lugar de tu infancia todavía puedes recordar con los ojos cerrados?</h3><button>Responder a esta pregunta</button><small>También puedes elegir otra pregunta</small></aside>
        </div>
        <section className="memory-box" id="recuerdos"><div className="panel-title"><div><p className="eyebrow">Tu archivo personal</p><h2>Caja de recuerdos</h2></div><button>＋ Añadir recuerdo</button></div><div className="memory-items"><div className="memory-item warm"><span>12</span><small>Fotografías</small></div><div className="memory-item olive"><span>3</span><small>Cartas</small></div><div className="memory-item clay"><span>5</span><small>Audios</small></div><div className="memory-item empty"><span>＋</span><small>Guardar algo nuevo</small></div></div></section>
      </section>
    </main>
  );
}
