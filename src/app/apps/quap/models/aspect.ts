import { Question } from './question';
import { QUESTIONNAIRE_TYPE_CANTON, QUESTIONNAIRE_TYPE_DEFAULT, QuestionnaireType } from './questionnaire';

export const DEPARTMENT_ASPECT_IDS = [
  8,  // Programmattraktivität
  9,  // Erfüllung Mitgliederbedürfnisse
  10, // Mitgliederzufriednheit
  11, // Image
  5,  // Werbung
  15, // Ressourcen
  12, // Mitgliederzahl
  6,  // Austausch und Zusammenarbeit mit externen Partnern
  2,  // Betreuungsnetzwerk
  0,  // Aus- und Weiterbildung
  14, // Motivation Leitende
  7,  // Auswertungskultur
  13, // Qualität im Leitungsteam
  3,  // Stufengerechtes Programm
  4,  // Umsetzung Pfadiprofil
  1,  // Betreuung der Leitenden
];
export const CANTON_ASPECT_IDS = [
  0,  // Abteilungsbetreuung
  1,  // Unterstützung Betreuende
  2,  // Anlassangebot
  3,  // Aus- und Weiterbildung der Funktionär*innen
  4,  // Besetzung der Gremien
  5,  // Kursangebot
  6,  // Kursbetreuung
  7,  // Gesundheit Abteilungen
  8,  // Mitgliederzahlen
  9,  // Image des KV
  10, // Motivation Engagement KV
  11, // Qualität auf kantonaler Ebene
  12, // Dank und Anerkennung von und für die kantonale Ebene
  13, // Ausgebildete Leiter*innen
  14, // Vernetzung Abteilungen
];

export interface Aspect {
  id: number;
  name: string;
  description: string;
  questions: Question[];
}

export const ASPECT_IDS_BY_QUESTIONNAIRE_TYPE: Record<QuestionnaireType, number[]> = {
  [QUESTIONNAIRE_TYPE_DEFAULT]: DEPARTMENT_ASPECT_IDS,
  [QUESTIONNAIRE_TYPE_CANTON]: CANTON_ASPECT_IDS,
}