import { AppIntent } from "./intent-types";

export const INTENT_KEYWORDS: Record<AppIntent, string[]> = {
  calibration: [
    "shot",
    "seconds",
    "sec",
    "sour",
    "bitter",
    "grind",
    "dose",
    "yield",
    "extraction",
    "экстрак",
    "шот",
    "кисло",
    "горько",
  ],
  audit: [
    "audit",
    "аттестация",
    "проверка",
    "стандарт",
    "оценка",
  ],
  training: [
    "обучение",
    "explain",
    "что",
    "разница",
    "why",
    "теория",
  ],
  menu: [
    "menu",
    "меню",
    "напитки",
    "ассортимент",
  ],
  settings: [
    "профиль",
    "настройки",
    "оборудование",
    "аккаунт",
  ],
  chat: [],
};