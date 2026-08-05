const Leaf = () => <span className="leaf" aria-hidden="true">⌁</span>;

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a href="/" className="brand" aria-label="Raíces, inicio"><Leaf />Raíces</a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#privacidad">Privacidad</a>
          <a href="#historias">Historias</a>
        </nav>
        <a href="/mi-espacio" className="button button-ghost">Entrar</a>
      </header>

      <section className="hero">
        <div className="hero-image" role="img" aria-label="Manos sosteniendo una antigua fotografía familiar sobre un cuaderno" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">Tu memoria, en un lugar seguro</p>
          <h1>Tu vida merece<br />ser contada.</h1>
          <p className="hero-copy">Un espacio privado para escribir, guardar tus recuerdos y compartirlos solo con quien tú elijas.</p>
          <div className="hero-actions">
            <a href="/mi-espacio" className="button button-primary">Comenzar mi historia <span>→</span></a>
            <a href="#como-funciona" className="button button-soft">Descubrir cómo funciona</a>
          </div>
          <p className="privacy-note"><span aria-hidden="true">⌾</span> Privado desde el primer momento</p>
        </div>
      </section>

      <section className="intro section" id="como-funciona">
        <div className="section-heading">
          <p className="eyebrow">Tu historia, a tu ritmo</p>
          <h2>Recordar también es<br />una forma de cuidar.</h2>
          <p>No necesitas saber escribir. Te acompañamos con preguntas delicadas para convertir tus recuerdos en relatos que suenen a ti.</p>
        </div>
        <div className="steps">
          <article className="step-card">
            <span className="step-number">01</span><span className="step-icon">✎</span>
            <h3>Escribe tu historia</h3>
            <p>Escribe libremente, responde preguntas o graba tu voz. Nosotros te ayudamos a ordenar y mejorar el relato sin cambiar tu esencia.</p>
          </article>
          <article className="step-card featured">
            <span className="step-number">02</span><span className="step-icon">▧</span>
            <h3>Guarda tus recuerdos</h3>
            <p>Acompaña cada historia con fotografías, audios, cartas o documentos. Todo queda reunido en tu caja de recuerdos.</p>
          </article>
          <article className="step-card">
            <span className="step-number">03</span><span className="step-icon">♧</span>
            <h3>Comparte con quien quieras</h3>
            <p>Tú decides qué historia puede ver cada persona. Nadie recibe acceso a toda tu vida por defecto.</p>
          </article>
        </div>
      </section>

      <section className="story-section section" id="historias">
        <div className="story-visual">
          <div className="paper-note"><span>12 de julio de 1978</span><strong>Un verano inolvidable</strong><p>Hay lugares que uno abandona, pero que nunca terminan de abandonarnos.</p></div>
          <div className="photo-card"><div className="memory-photo" /><span>En casa de los abuelos</span></div>
        </div>
        <div className="story-copy">
          <p className="eyebrow">Mucho más que un blog</p>
          <h2>Un hogar para todo lo que no quieres olvidar.</h2>
          <p>Cada historia puede ser tan sencilla o profunda como necesites. Una fotografía, una carta, una voz o unas pocas palabras pueden guardar toda una vida.</p>
          <ul className="feature-list">
            <li><span>✓</span><div><strong>Preguntas que te ayudan a recordar</strong><small>Te acompañamos sin presionarte.</small></div></li>
            <li><span>✓</span><div><strong>Tu voz siempre permanece</strong><small>Corregimos y damos claridad, sin escribir por ti.</small></div></li>
            <li><span>✓</span><div><strong>Fotos y audios cuando tú quieras</strong><small>No todas las historias necesitan una imagen.</small></div></li>
          </ul>
        </div>
      </section>

      <section className="privacy-section section" id="privacidad">
        <div className="privacy-copy">
          <p className="eyebrow light">Privado por naturaleza</p>
          <h2>Tu historia no pertenece a internet. Te pertenece a ti.</h2>
          <p>Todo comienza siendo privado. Puedes conservarlo solo para ti, invitar a una persona concreta o compartir una historia con tu familia.</p>
          <a href="/mi-espacio" className="text-link">Conocer mi espacio privado <span>→</span></a>
        </div>
        <div className="permission-card">
          <div className="permission-top"><span className="lock">⌾</span><div><small>Historia protegida</small><strong>La casa donde crecí</strong></div><button aria-label="Opciones de la historia">•••</button></div>
          <div className="permission-row"><span>Solo yo</span><strong>Activo</strong></div>
          <div className="permission-row"><span>Familia</span><em>5 personas</em></div>
          <div className="permission-row"><span>Enlace privado</span><em>Desactivado</em></div>
          <p>Solo tú decides quién puede verlo.</p>
        </div>
      </section>

      <section className="closing section">
        <Leaf />
        <h2>Hay historias que merecen quedarse.</h2>
        <p>Empieza por un recuerdo. No tiene que estar perfecto, solo tiene que ser tuyo.</p>
        <a href="/mi-espacio" className="button button-primary">Comenzar mi historia <span>→</span></a>
      </section>

      <footer>
        <a href="/" className="brand"><Leaf />Raíces</a>
        <p>Un espacio íntimo para preservar lo que importa.</p>
        <div className="footer-links"><a href="#privacidad">Privacidad</a><a href="#como-funciona">Cómo funciona</a></div>
        <a className="creator-credit" href="https://www.instagram.com/bryans_quiroz/" target="_blank" rel="noopener noreferrer" aria-label="Diseño y desarrollo web por Quiroz. Ver Instagram de Bryans Quiroz">
          <span className="creator-mark" aria-hidden="true">Q</span>
          <span className="creator-copy"><small>Diseño y desarrollo web por</small><strong>Quiroz · @bryans_quiroz</strong></span>
          <span className="creator-instagram" aria-hidden="true">Instagram ↗</span>
        </a>
      </footer>
    </main>
  );
}
