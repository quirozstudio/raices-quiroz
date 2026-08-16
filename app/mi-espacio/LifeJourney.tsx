"use client";

import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";

type AnswerMap = Record<string, string>;
type JourneyRow = {
  owner_id: string;
  answers: AnswerMap;
  current_step: number;
  summary: string | null;
  completed: boolean;
};

type Choice = { label: string; value: string; portrait: string };
type TestQuestion = {
  id: string;
  chapter: string;
  title: string;
  context: string;
  choices: Choice[];
};
type EmotionalQuestion = {
  id: string;
  chapter: string;
  title: string;
  context: string;
  placeholder: string;
};

const testQuestions: TestQuestion[] = [
  {
    id: "childhood_place",
    chapter: "I · Tus raíces",
    title: "Cuando piensas en tu infancia, ¿qué imagen aparece primero?",
    context: "No buscamos una respuesta perfecta. Elige la escena que más se acerque a la sensación de aquellos años.",
    choices: [
      { label: "Una casa llena de voces", value: "home", portrait: "sus primeros recuerdos están unidos a una casa viva, poblada de voces y presencias" },
      { label: "La calle, el campo o el barrio", value: "outside", portrait: "aprendió a mirar el mundo desde la calle, el campo o el barrio que le vio crecer" },
      { label: "Un lugar tranquilo y muy suyo", value: "quiet", portrait: "desde pequeño encontró refugio en los lugares tranquilos y en su mundo interior" },
      { label: "Una etapa de muchos cambios", value: "changes", portrait: "su infancia estuvo marcada por cambios que le enseñaron pronto a adaptarse" },
    ],
  },
  {
    id: "home_feeling",
    chapter: "I · Tus raíces",
    title: "¿Qué emoción describiría mejor el hogar en el que creciste?",
    context: "Piensa en el ambiente cotidiano: las conversaciones, los silencios, las rutinas y la forma de cuidaros.",
    choices: [
      { label: "Calidez y protección", value: "warmth", portrait: "guarda la calidez y la protección familiar como una de sus raíces" },
      { label: "Esfuerzo y responsabilidad", value: "effort", portrait: "creció entendiendo el valor del esfuerzo y la responsabilidad" },
      { label: "Libertad y curiosidad", value: "freedom", portrait: "la curiosidad y la libertad fueron motores importantes en sus primeros años" },
      { label: "Complejidad y aprendizaje", value: "complexity", portrait: "transformó una infancia compleja en aprendizaje y sensibilidad" },
    ],
  },
  {
    id: "important_people",
    chapter: "I · Tus raíces",
    title: "¿Quién dejó una huella más profunda en tu manera de ser?",
    context: "No hace falta elegir un nombre todavía. Elige el tipo de vínculo que más influyó en ti.",
    choices: [
      { label: "Mi madre, padre o quienes me criaron", value: "parents", portrait: "la forma de cuidar de quienes le criaron sigue presente en su manera de vivir" },
      { label: "Mis abuelos o una persona mayor", value: "elders", portrait: "conserva enseñanzas profundas recibidas de una persona mayor" },
      { label: "Mis hermanos, amistades o compañeros", value: "peers", portrait: "los vínculos compartidos con iguales moldearon su carácter" },
      { label: "Aprendí principalmente por mí mismo/a", value: "self", portrait: "desarrolló una gran autonomía aprendiendo a sostenerse y orientarse" },
    ],
  },
  {
    id: "young_self",
    chapter: "II · Tu camino",
    title: "Al entrar en la juventud, ¿qué buscabas con más fuerza?",
    context: "Recuerda lo que deseabas antes de que la vida tomara su forma actual.",
    choices: [
      { label: "Encontrar mi lugar", value: "belonging", portrait: "durante su juventud buscó un lugar en el que pudiera sentirse plenamente parte" },
      { label: "Ser independiente", value: "independence", portrait: "la independencia fue una dirección decisiva en su camino" },
      { label: "Vivir experiencias y descubrir", value: "discovery", portrait: "eligió conocer, probar y descubrir antes de quedarse quieto" },
      { label: "Cuidar y construir una familia", value: "family", portrait: "muy pronto sintió el deseo de cuidar y construir vínculos duraderos" },
    ],
  },
  {
    id: "turning_points",
    chapter: "II · Tu camino",
    title: "¿Qué clase de decisión cambió más el rumbo de tu vida?",
    context: "Puede haber muchas, pero suele existir una clase de decisión que vuelve una y otra vez.",
    choices: [
      { label: "Una relación o una despedida", value: "relationship", portrait: "sus grandes cambios estuvieron ligados al amor, los vínculos y las despedidas" },
      { label: "Un trabajo o una vocación", value: "work", portrait: "el trabajo y la búsqueda de propósito marcaron varios de sus giros vitales" },
      { label: "Una mudanza o un nuevo comienzo", value: "move", portrait: "ha sabido comenzar de nuevo cuando la vida le ha pedido cambiar de escenario" },
      { label: "Una dificultad que tuve que atravesar", value: "difficulty", portrait: "una dificultad importante terminó revelando una fortaleza que quizá desconocía" },
    ],
  },
  {
    id: "way_of_living",
    chapter: "II · Tu camino",
    title: "Cuando la vida se complica, ¿cómo sueles seguir adelante?",
    context: "Elige la respuesta que más se parece a ti, incluso si no siempre funciona de la misma manera.",
    choices: [
      { label: "Me apoyo en las personas que quiero", value: "people", portrait: "encuentra fuerza en la compañía y en los afectos verdaderos" },
      { label: "Me concentro en resolver lo inmediato", value: "action", portrait: "avanza resolviendo paso a paso aquello que tiene delante" },
      { label: "Necesito silencio y tiempo para ordenar", value: "reflection", portrait: "necesita silencio y reflexión para comprender lo vivido" },
      { label: "Transformo lo difícil en una nueva meta", value: "purpose", portrait: "suele convertir los momentos difíciles en nuevas metas" },
    ],
  },
  {
    id: "proud_of",
    chapter: "III · Lo que has construido",
    title: "Mirando hacia atrás, ¿qué te produce un orgullo más sereno?",
    context: "No hablamos del éxito que otros ven, sino de aquello que tú sabes lo que costó.",
    choices: [
      { label: "La familia o los vínculos que he cuidado", value: "bonds", portrait: "se reconoce especialmente en los vínculos que ha cuidado con constancia" },
      { label: "Haberme levantado después de caer", value: "resilience", portrait: "su orgullo nace de haberse levantado incluso cuando parecía difícil" },
      { label: "Lo que he creado con mi trabajo", value: "creation", portrait: "encuentra sentido en todo aquello que ha construido con esfuerzo" },
      { label: "Seguir siendo fiel a quien soy", value: "identity", portrait: "valora haber conservado su identidad a través de los cambios" },
    ],
  },
  {
    id: "present_values",
    chapter: "III · Lo que has construido",
    title: "Hoy, ¿qué ocupa el centro de tu vida?",
    context: "Esta respuesta será el puente entre tu historia pasada y la persona que eres ahora.",
    choices: [
      { label: "Mi familia y las personas cercanas", value: "family_now", portrait: "hoy coloca a las personas cercanas en el centro de su vida" },
      { label: "La paz y el equilibrio", value: "peace", portrait: "en el presente busca una vida con más paz, verdad y equilibrio" },
      { label: "Seguir creciendo y aprendiendo", value: "growth", portrait: "mantiene viva la necesidad de crecer y seguir aprendiendo" },
      { label: "Dejar algo valioso detrás de mí", value: "legacy", portrait: "mira hacia delante con el deseo de dejar algo valioso a los demás" },
    ],
  },
];

const emotionalQuestions: EmotionalQuestion[] = [
  {
    id: "hard_moment",
    chapter: "IV · Lo que llevas dentro",
    title: "¿Qué momento difícil te cambió por dentro, aunque casi nadie supiera todo lo que estabas viviendo?",
    context: "Puedes contar solo aquello que quieras. Describe qué ocurrió, qué sentiste y qué parte de ti nació después.",
    placeholder: "Recuerdo que… Lo más difícil fue… Con el tiempo comprendí…",
  },
  {
    id: "safe_person",
    chapter: "IV · Lo que llevas dentro",
    title: "¿Quién te hizo sentir visto, acompañado o querido de una manera que nunca olvidaste?",
    context: "Puede ser alguien que aún está, alguien que ya no está o incluso una persona que apareció durante poco tiempo.",
    placeholder: "Esa persona fue importante porque… A su lado yo podía…",
  },
  {
    id: "happy_memory",
    chapter: "V · La luz de tu historia",
    title: "Si pudieras volver durante cinco minutos a un momento feliz, ¿cuál elegirías y qué querrías sentir otra vez?",
    context: "Detente en los detalles: el lugar, las voces, una mirada, un olor o la sensación de aquel instante.",
    placeholder: "Volvería a… Estaban conmigo… Lo que todavía puedo sentir es…",
  },
  {
    id: "legacy_words",
    chapter: "V · La huella que dejas",
    title: "¿Qué te gustaría que las personas que amas comprendieran de ti al leer tu historia?",
    context: "Escribe como si dejaras unas palabras honestas para alguien importante.",
    placeholder: "Me gustaría que supierais que… Si algo he aprendido es…",
  },
];

function buildPortrait(firstName: string, answers: AnswerMap, includeEmotions: boolean) {
  const fragments = testQuestions
    .map((question) => question.choices.find((choice) => choice.value === answers[question.id])?.portrait)
    .filter(Boolean);
  const opening = fragments.length
    ? `${firstName} es una persona cuya historia comienza en unas raíces que todavía siguen presentes: ${fragments.slice(0, 3).join("; ")}.`
    : `${firstName} ha comenzado a recorrer su historia con calma y honestidad.`;
  const path = fragments.length > 3
    ? `A lo largo del camino, ${fragments.slice(3, 6).join("; ")}. Al mirar lo construido, ${fragments.slice(6).join("; ")}.`
    : "";
  if (!includeEmotions) {
    return `${opening} ${path} Este es un primer retrato: todavía quedan emociones, personas y recuerdos que podrán darle una voz más íntima y completa.`.replace(/\s+/g, " ").trim();
  }
  const emotional = emotionalQuestions
    .map((question) => answers[question.id]?.trim())
    .filter(Boolean)
    .map((answer) => answer.length > 220 ? `${answer.slice(0, 217)}…` : answer);
  const innerLife = emotional.length
    ? `En sus propias palabras también aparecen las experiencias que más le han tocado: ${emotional.join(" ")}`
    : "Este retrato queda abierto para seguir incorporando recuerdos y emociones cuando llegue el momento.";
  return `${opening} ${path} ${innerLife}`.replace(/\s+/g, " ").trim();
}

export default function LifeJourney({
  user,
  firstName,
  supabase,
  onCreateStory,
  notice,
}: {
  user: User;
  firstName: string;
  supabase: SupabaseClient;
  onCreateStory: (prompt?: string, title?: string, content?: string) => Promise<void>;
  notice: (message: string) => void;
}) {
  const [journey, setJourney] = useState<JourneyRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    let active = true;
    supabase.from("life_journeys").select("*").eq("owner_id", user.id).maybeSingle().then(({ data, error }) => {
      if (!active) return;
      if (error) notice("No hemos podido recuperar tu recorrido.");
      setJourney((data as JourneyRow | null) || {
        owner_id: user.id,
        answers: {},
        current_step: 0,
        summary: null,
        completed: false,
      });
      setLoading(false);
    });
    return () => { active = false; };
  }, [notice, supabase, user.id]);

  const answers = journey?.answers || {};
  const currentStep = journey?.current_step || 0;
  const testPortrait = useMemo(() => buildPortrait(firstName, answers, false), [answers, firstName]);
  const finalPortrait = useMemo(() => buildPortrait(firstName, answers, true), [answers, firstName]);
  const isTestReflection = currentStep === testQuestions.length && answers._test_reviewed !== "yes";
  const emotionalIndex = currentStep - testQuestions.length;
  const currentTest = currentStep < testQuestions.length ? testQuestions[currentStep] : null;
  const currentEmotional = emotionalIndex >= 0 && emotionalIndex < emotionalQuestions.length ? emotionalQuestions[emotionalIndex] : null;
  const totalAnswered = Object.keys(answers).filter((key) => key !== "_test_reviewed").length;

  useEffect(() => {
    if (currentEmotional) setDraft(answers[currentEmotional.id] || "");
  }, [answers, currentEmotional]);

  async function persist(nextAnswers: AnswerMap, nextStep: number, completed = false) {
    setSaving(true);
    const summary = completed ? buildPortrait(firstName, nextAnswers, true) : null;
    const next: JourneyRow = {
      owner_id: user.id,
      answers: nextAnswers,
      current_step: nextStep,
      summary,
      completed,
    };
    const { error } = await supabase.from("life_journeys").upsert({
      ...next,
      updated_at: new Date().toISOString(),
    }, { onConflict: "owner_id" });
    setSaving(false);
    if (error) {
      notice("No hemos podido guardar esta respuesta. Inténtalo de nuevo.");
      return false;
    }
    setJourney(next);
    return true;
  }

  async function choose(question: TestQuestion, value: string) {
    if (saving) return;
    await persist({ ...answers, [question.id]: value }, currentStep + 1);
  }

  async function continueToEmotions() {
    await persist({ ...answers, _test_reviewed: "yes" }, currentStep);
  }

  async function saveEmotionalAnswer() {
    if (!currentEmotional || !draft.trim() || saving) return;
    const nextAnswers = { ...answers, [currentEmotional.id]: draft.trim() };
    const nextStep = currentStep + 1;
    await persist(nextAnswers, nextStep, nextStep === testQuestions.length + emotionalQuestions.length);
  }

  async function goBack() {
    if (saving || currentStep === 0) return;
    if (isTestReflection) {
      await persist({ ...answers, _test_reviewed: "" }, currentStep - 1);
      return;
    }
    await persist(answers, currentStep - 1);
  }

  async function restart() {
    if (!confirm("¿Quieres empezar de nuevo? Tus respuestas de este recorrido se borrarán.")) return;
    const { error } = await supabase.from("life_journeys").delete().eq("owner_id", user.id);
    if (error) return notice("No hemos podido reiniciar el recorrido.");
    setJourney({ owner_id: user.id, answers: {}, current_step: 0, summary: null, completed: false });
    notice("Tu recorrido está preparado para comenzar de nuevo.");
  }

  if (loading || !journey) return <div className="loading">Preparando las preguntas con cuidado…</div>;

  if (journey.completed) {
    return <section className="journey-finish">
      <p className="eyebrow">Tu retrato vital</p>
      <h2>Una primera mirada a tu historia</h2>
      <p className="journey-summary">{journey.summary || finalPortrait}</p>
      <div className="journey-finish-actions">
        <button className="button button-primary" onClick={() => onCreateStory("Mi recorrido vital", `El camino de ${firstName}`, journey.summary || finalPortrait)}>Convertirlo en una historia</button>
        <button className="button button-soft" onClick={restart}>Volver a empezar</button>
      </div>
      <small>Este texto no pretende definirte. Es una semilla construida con tus respuestas para que puedas seguir escribiendo con tu propia voz.</small>
    </section>;
  }

  if (isTestReflection) {
    return <section className="journey-reflection">
      <div className="journey-progress"><span>Primera parte completada</span><strong>8 de 12</strong></div>
      <p className="eyebrow">Lo que cuentan tus elecciones</p>
      <h2>{firstName}, este es tu primer retrato</h2>
      <p className="journey-summary">{testPortrait}</p>
      <div className="journey-note"><span>♡</span><p>Ahora dejaremos atrás las opciones. Las siguientes preguntas son más emocionales y podrás responderlas con tus propias palabras, sin prisa y sin obligación de contarlo todo.</p></div>
      <div className="journey-actions">
        <button className="button button-soft" onClick={goBack}>Volver</button>
        <button className="button button-primary" onClick={continueToEmotions} disabled={saving}>{saving ? "Guardando…" : "Continuar con mis palabras"}</button>
      </div>
    </section>;
  }

  const chapter = currentTest?.chapter || currentEmotional?.chapter || "";
  const title = currentTest?.title || currentEmotional?.title || "";
  const context = currentTest?.context || currentEmotional?.context || "";

  return <section className="journey-card">
    <div className="journey-progress">
      <span>{chapter}</span>
      <strong>{Math.min(currentStep + 1, 12)} de 12</strong>
    </div>
    <div className="journey-progress-line"><span style={{ width: `${Math.max(8, (totalAnswered / 12) * 100)}%` }} /></div>
    <p className="eyebrow">{currentTest ? "Elige la que más se acerque a ti" : "Responde con tus propias palabras"}</p>
    <h2>{title}</h2>
    <p className="journey-context">{context}</p>
    {currentTest ? <div className="journey-options">
      {currentTest.choices.map((choice) => <button key={choice.value} onClick={() => choose(currentTest, choice.value)} disabled={saving}>
        <span>{choice.label}</span><b>→</b>
      </button>)}
    </div> : currentEmotional ? <div className="journey-open-answer">
      <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={currentEmotional.placeholder} rows={8} />
      <small>Tu respuesta se guarda de forma privada y podrás convertirla en historia al terminar.</small>
    </div> : null}
    <div className="journey-actions">
      <button className="button button-soft" onClick={goBack} disabled={currentStep === 0 || saving}>Anterior</button>
      {currentEmotional && <button className="button button-primary" onClick={saveEmotionalAnswer} disabled={!draft.trim() || saving}>{saving ? "Guardando…" : currentStep === 11 ? "Terminar mi recorrido" : "Guardar y continuar"}</button>}
    </div>
  </section>;
}
