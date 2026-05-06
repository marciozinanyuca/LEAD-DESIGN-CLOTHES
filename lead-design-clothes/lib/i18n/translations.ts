export const SUPPORTED_LOCALES = ["en", "es", "pt"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const localeOptions: { value: Locale; label: string }[] = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
];

export const translations = {
  en: {
    "topbar.studio": "Studio",
    "topbar.catalog": "Catalog",
    "topbar.review": "Review",
    "topbar.finalStep": "Final Step",
    "topbar.editor": "Editor",
    "language.label": "Language",
    "studio.garmentsCount": "{count} garments",
    "editor.quickExport": "Quick Export",
    "editor.reviewExport": "Review & Export",
    "editor.loadingGarment": "Loading garment...",
    "editor.deselectHint":
      "Click canvas to deselect · Drag to move · Handles to resize & rotate",
    "editor.backToCatalog": "← Back to Catalog",
    "editor.objectsCount": "{count} object{suffix}",
    "editor.nextReview": "Next: Review →",
    "review.backToEditor": "← Back to Editor",
    "review.export": "Export",
    "side.front": "Front",
    "side.back": "Back",
  },
  es: {
    "topbar.studio": "Estudio",
    "topbar.catalog": "Catálogo",
    "topbar.review": "Revisión",
    "topbar.finalStep": "Paso final",
    "topbar.editor": "Editor",
    "language.label": "Idioma",
    "studio.garmentsCount": "{count} prendas",
    "editor.quickExport": "Exportación rápida",
    "editor.reviewExport": "Revisar y exportar",
    "editor.loadingGarment": "Cargando prenda...",
    "editor.deselectHint":
      "Haz clic en el lienzo para deseleccionar · Arrastra para mover · Usa los controles para cambiar tamaño y rotar",
    "editor.backToCatalog": "← Volver al catálogo",
    "editor.objectsCount": "{count} objeto{suffix}",
    "editor.nextReview": "Siguiente: Revisión →",
    "review.backToEditor": "← Volver al editor",
    "review.export": "Exportar",
    "side.front": "Frente",
    "side.back": "Espalda",
  },
  pt: {
    "topbar.studio": "Estúdio",
    "topbar.catalog": "Catálogo",
    "topbar.review": "Revisão",
    "topbar.finalStep": "Etapa final",
    "topbar.editor": "Editor",
    "language.label": "Idioma",
    "studio.garmentsCount": "{count} peças",
    "editor.quickExport": "Exportação rápida",
    "editor.reviewExport": "Revisar e exportar",
    "editor.loadingGarment": "Carregando peça...",
    "editor.deselectHint":
      "Clique na tela para desmarcar · Arraste para mover · Use as alças para redimensionar e girar",
    "editor.backToCatalog": "← Voltar ao catálogo",
    "editor.objectsCount": "{count} objeto{suffix}",
    "editor.nextReview": "Próximo: Revisão →",
    "review.backToEditor": "← Voltar ao editor",
    "review.export": "Exportar",
    "side.front": "Frente",
    "side.back": "Costas",
  },
} as const;

export type TranslationKey = string;

export function formatTranslation(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>
) {
  const template =
    (translations[locale] as Record<string, string>)[key] ??
    (translations.en as Record<string, string>)[key] ??
    key;

  if (!params) return template;

  return template.replace(/\{(\w+)\}/g, (_, token: string) =>
    String(params[token] ?? `{${token}}`)
  );
}
