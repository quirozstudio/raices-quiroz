export type NarrativeArea =
  | "orígenes"
  | "infancia"
  | "familia"
  | "hogares"
  | "amistades"
  | "amor"
  | "trabajo"
  | "lugares"
  | "tradiciones"
  | "dificultades"
  | "valores"
  | "legado";

export type NarrativeQuestion = {
  id: string;
  area: NarrativeArea;
  text: string;
  tags: string[];
  kind: "opening" | "deepening" | "reflection";
};

export const narrativeQuestionLibrary: NarrativeQuestion[] = [
  { id: "origins_first_story", area: "orígenes", text: "¿Qué te han contado sobre el día en que naciste?", tags: ["birth", "family", "origin"], kind: "opening" },
  { id: "origins_name", area: "orígenes", text: "¿Sabes por qué eligieron tu nombre?", tags: ["birth", "name", "family"], kind: "deepening" },
  { id: "origins_birthplace", area: "orígenes", text: "¿Qué relación tienes con el lugar donde naciste?", tags: ["birth", "place", "identity"], kind: "reflection" },
  { id: "origins_family_story", area: "orígenes", text: "¿Qué historia familiar escuchaste tantas veces que forma parte de ti?", tags: ["family", "origin", "story"], kind: "opening" },
  { id: "origins_ancestors", area: "orígenes", text: "¿Qué te gustaría saber de tus antepasados?", tags: ["family", "ancestors", "curiosity"], kind: "reflection" },
  { id: "origins_first_photo", area: "orígenes", text: "¿Qué sientes cuando miras tus primeras fotografías?", tags: ["birth", "photography", "emotion"], kind: "deepening" },
  { id: "childhood_home", area: "infancia", text: "¿Cómo recuerdas la casa donde creciste?", tags: ["home", "childhood", "senses"], kind: "opening" },
  { id: "childhood_corner", area: "infancia", text: "¿Qué rincón de aquella casa recuerdas mejor?", tags: ["home", "childhood", "place"], kind: "deepening" },
  { id: "childhood_sound", area: "infancia", text: "¿Había algún sonido que anunciara que estabas en casa?", tags: ["home", "childhood", "sound"], kind: "deepening" },
  { id: "childhood_smell", area: "infancia", text: "¿Qué olor puede devolverte de inmediato a tu infancia?", tags: ["childhood", "smell", "memory"], kind: "opening" },
  { id: "childhood_game", area: "infancia", text: "¿A qué jugabas cuando nadie te decía cómo hacerlo?", tags: ["childhood", "play", "freedom"], kind: "opening" },
  { id: "childhood_fear", area: "infancia", text: "¿Qué miedo de entonces hoy puedes mirar de otra manera?", tags: ["childhood", "fear", "growth"], kind: "reflection" },
  { id: "family_grandparents", area: "familia", text: "¿Qué recuerdas de tus abuelos o de las personas mayores que te cuidaron?", tags: ["family", "elders", "care"], kind: "opening" },
  { id: "family_lessons", area: "familia", text: "¿Qué enseñanza familiar todavía aparece en tus decisiones?", tags: ["family", "values", "learning"], kind: "reflection" },
  { id: "family_sibling", area: "familia", text: "¿Qué momento compartido con tus hermanos o personas cercanas te gustaría conservar?", tags: ["family", "siblings", "memory"], kind: "deepening" },
  { id: "family_table", area: "familia", text: "¿Qué ocurría alrededor de la mesa en tu familia?", tags: ["family", "food", "tradition"], kind: "opening" },
  { id: "family_unsaid", area: "familia", text: "¿Qué cosas importantes se entendían sin necesidad de decirlas?", tags: ["family", "silence", "emotion"], kind: "deepening" },
  { id: "family_resemblance", area: "familia", text: "¿En qué gesto, costumbre o manera de hablar reconoces a tu familia en ti?", tags: ["family", "identity", "body"], kind: "reflection" },
  { id: "homes_first_move", area: "hogares", text: "¿Cuál fue la primera mudanza que recuerdas?", tags: ["home", "change", "place"], kind: "opening" },
  { id: "homes_room", area: "hogares", text: "¿Cómo era el lugar donde dormías o pasabas más tiempo?", tags: ["home", "childhood", "place"], kind: "deepening" },
  { id: "homes_neighborhood", area: "hogares", text: "¿Qué personas y lugares daban vida a tu barrio?", tags: ["home", "neighborhood", "community"], kind: "opening" },
  { id: "homes_leaving", area: "hogares", text: "¿Qué dejaste atrás al marcharte de un lugar importante?", tags: ["home", "change", "farewell"], kind: "reflection" },
  { id: "homes_feeling", area: "hogares", text: "¿Qué necesitaba tener un lugar para que pudieras sentirlo como hogar?", tags: ["home", "belonging", "values"], kind: "reflection" },
  { id: "homes_return", area: "hogares", text: "¿Hay algún lugar al que volverías solo para observarlo una vez más?", tags: ["home", "place", "memory"], kind: "reflection" },
  { id: "friends_first", area: "amistades", text: "¿Quién fue una de tus primeras amistades y qué hacíais juntos?", tags: ["friendship", "childhood", "people"], kind: "opening" },
  { id: "friends_laughter", area: "amistades", text: "¿Qué recuerdo de una amistad todavía te hace sonreír?", tags: ["friendship", "joy", "memory"], kind: "deepening" },
  { id: "friends_loyalty", area: "amistades", text: "¿Cuándo sentiste que alguien estuvo de verdad a tu lado?", tags: ["friendship", "care", "trust"], kind: "deepening" },
  { id: "friends_distance", area: "amistades", text: "¿Qué amistad cambió con el tiempo y cómo lo viviste?", tags: ["friendship", "change", "farewell"], kind: "reflection" },
  { id: "friends_you", area: "amistades", text: "¿Qué parte de ti aparecía cuando estabas con tus mejores amistades?", tags: ["friendship", "identity", "freedom"], kind: "reflection" },
  { id: "friends_gratitude", area: "amistades", text: "¿A quién te gustaría agradecerle algo que quizá nunca le dijiste?", tags: ["friendship", "gratitude", "legacy"], kind: "reflection" },
  { id: "love_first", area: "amor", text: "¿Qué recuerdas de la primera vez que sentiste algo parecido al amor?", tags: ["love", "youth", "emotion"], kind: "opening" },
  { id: "love_gesture", area: "amor", text: "¿Qué pequeño gesto de alguien importante nunca olvidaste?", tags: ["love", "care", "memory"], kind: "deepening" },
  { id: "love_learning", area: "amor", text: "¿Qué aprendiste sobre ti a través de una relación?", tags: ["love", "identity", "learning"], kind: "reflection" },
  { id: "love_home", area: "amor", text: "¿Qué significa para ti construir un hogar con otra persona?", tags: ["love", "home", "values"], kind: "reflection" },
  { id: "love_farewell", area: "amor", text: "¿Qué despedida te enseñó algo sobre querer y dejar ir?", tags: ["love", "farewell", "growth"], kind: "reflection" },
  { id: "love_now", area: "amor", text: "¿Cómo te gustaría cuidar hoy a las personas que amas?", tags: ["love", "care", "present"], kind: "reflection" },
  { id: "work_first", area: "trabajo", text: "¿Cuál fue tu primer trabajo y qué descubriste allí?", tags: ["work", "youth", "learning"], kind: "opening" },
  { id: "work_vocation", area: "trabajo", text: "¿Cuándo sentiste que una actividad podía convertirse en vocación?", tags: ["work", "purpose", "identity"], kind: "reflection" },
  { id: "work_people", area: "trabajo", text: "¿Qué persona del trabajo dejó una huella en tu manera de hacer las cosas?", tags: ["work", "people", "learning"], kind: "deepening" },
  { id: "work_pride", area: "trabajo", text: "¿Qué has construido con tus manos o con tu esfuerzo?", tags: ["work", "pride", "creation"], kind: "opening" },
  { id: "work_change", area: "trabajo", text: "¿Qué decisión profesional cambió tu camino?", tags: ["work", "change", "decision"], kind: "reflection" },
  { id: "work_balance", area: "trabajo", text: "¿Qué te gustaría haber protegido mejor mientras trabajabas?", tags: ["work", "care", "values"], kind: "reflection" },
  { id: "places_trip", area: "lugares", text: "¿Qué viaje te cambió aunque no fuera el más lejano?", tags: ["travel", "change", "place"], kind: "opening" },
  { id: "places_street", area: "lugares", text: "¿Qué calle podrías recorrer todavía con los ojos cerrados?", tags: ["place", "memory", "senses"], kind: "deepening" },
  { id: "places_landscape", area: "lugares", text: "¿Qué paisaje se quedó contigo después de marcharte?", tags: ["travel", "landscape", "emotion"], kind: "opening" },
  { id: "places_people", area: "lugares", text: "¿Qué lugar recuerdas sobre todo por las personas que estaban allí?", tags: ["place", "people", "memory"], kind: "deepening" },
  { id: "places_return", area: "lugares", text: "¿Qué lugar te gustaría enseñar a alguien que quieres?", tags: ["place", "love", "legacy"], kind: "reflection" },
  { id: "places_belonging", area: "lugares", text: "¿En qué lugar te has sentido más tú?", tags: ["place", "identity", "belonging"], kind: "reflection" },
  { id: "traditions_song", area: "tradiciones", text: "¿Qué canción te devuelve a una época concreta de tu vida?", tags: ["tradition", "music", "memory"], kind: "opening" },
  { id: "traditions_meal", area: "tradiciones", text: "¿Qué comida sabe a celebración en tu familia?", tags: ["tradition", "food", "family"], kind: "deepening" },
  { id: "traditions_festival", area: "tradiciones", text: "¿Qué celebración reunía a más personas cuando eras pequeño?", tags: ["tradition", "family", "community"], kind: "opening" },
  { id: "traditions_object", area: "tradiciones", text: "¿Qué objeto familiar ha pasado de unas manos a otras?", tags: ["tradition", "object", "family"], kind: "deepening" },
  { id: "traditions_change", area: "tradiciones", text: "¿Qué costumbre has conservado y cuál has decidido transformar?", tags: ["tradition", "change", "values"], kind: "reflection" },
  { id: "traditions_teach", area: "tradiciones", text: "¿Qué tradición te gustaría transmitir a la siguiente generación?", tags: ["tradition", "legacy", "family"], kind: "reflection" },
  { id: "hard_moment", area: "dificultades", text: "¿Qué momento difícil te cambió por dentro, aunque casi nadie supiera todo lo que vivías?", tags: ["difficulty", "emotion", "growth"], kind: "reflection" },
  { id: "hard_help", area: "dificultades", text: "¿Quién o qué te ayudó a atravesar una etapa complicada?", tags: ["difficulty", "care", "people"], kind: "deepening" },
  { id: "hard_decision", area: "dificultades", text: "¿Qué decisión tomaste sin tener todas las respuestas?", tags: ["difficulty", "decision", "courage"], kind: "opening" },
  { id: "hard_strength", area: "dificultades", text: "¿Qué fortaleza descubriste en ti cuando no la estabas buscando?", tags: ["difficulty", "strength", "identity"], kind: "reflection" },
  { id: "hard_after", area: "dificultades", text: "¿Qué cambió en tu forma de mirar la vida después de superar algo difícil?", tags: ["difficulty", "change", "growth"], kind: "reflection" },
  { id: "hard_gentleness", area: "dificultades", text: "¿Qué necesitarías decirle hoy a la persona que eras en aquel momento?", tags: ["difficulty", "care", "self"], kind: "reflection" },
  { id: "values_teach", area: "valores", text: "¿Qué valor te enseñaron en casa y cuál elegiste por ti mismo?", tags: ["values", "family", "identity"], kind: "reflection" },
  { id: "values_change", area: "valores", text: "¿Qué opinión importante has cambiado con los años?", tags: ["values", "change", "learning"], kind: "reflection" },
  { id: "values_no", area: "valores", text: "¿Qué has aprendido a decir que no para cuidar tu vida?", tags: ["values", "boundaries", "care"], kind: "reflection" },
  { id: "values_peace", area: "valores", text: "¿Qué significa para ti vivir una vida tranquila?", tags: ["values", "peace", "present"], kind: "reflection" },
  { id: "values_proud", area: "valores", text: "¿De qué parte de tu forma de ser te sientes orgulloso en silencio?", tags: ["values", "pride", "identity"], kind: "reflection" },
  { id: "values_advice", area: "valores", text: "¿Qué consejo solo puedes dar porque lo has vivido?", tags: ["values", "learning", "legacy"], kind: "reflection" },
  { id: "legacy_message", area: "legado", text: "¿Qué te gustaría que comprendieran de ti las personas que amas?", tags: ["legacy", "love", "message"], kind: "reflection" },
  { id: "legacy_photo", area: "legado", text: "Si pudieras dejar una fotografía con unas palabras detrás, ¿qué escribirías?", tags: ["legacy", "photography", "message"], kind: "reflection" },
  { id: "legacy_lesson", area: "legado", text: "¿Qué aprendizaje te gustaría que no se perdiera cuando tú no estés?", tags: ["legacy", "learning", "family"], kind: "reflection" },
  { id: "legacy_people", area: "legado", text: "¿Qué personas deberían aparecer siempre cuando se cuente tu historia?", tags: ["legacy", "people", "story"], kind: "reflection" },
  { id: "legacy_remembered", area: "legado", text: "¿Cómo te gustaría ser recordado, más allá de tus logros?", tags: ["legacy", "identity", "values"], kind: "reflection" },
  { id: "legacy_beginning", area: "legado", text: "¿Qué historia te queda por contar y te gustaría empezar algún día?", tags: ["legacy", "story", "future"], kind: "opening" },
];

export const narrativePrompts = narrativeQuestionLibrary.map((question) => question.text);

export function getRelatedQuestions(answer: string, excludedIds: string[] = [], limit = 3) {
  const words = new Set(answer.toLowerCase().split(/[^a-záéíóúüñ]+/).filter((word) => word.length > 4));
  return narrativeQuestionLibrary
    .filter((question) => !excludedIds.includes(question.id))
    .map((question) => ({ question, score: question.tags.reduce((score, tag) => score + (words.has(tag) ? 2 : 0), 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ question }) => question);
}
