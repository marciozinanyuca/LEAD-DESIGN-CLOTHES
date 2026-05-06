/**
 * TextToolPanel — Add and configure text design objects
 */

"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { useLanguage } from "@/components/providers/LanguageProvider";

const FONT_FAMILIES = ["Manrope", "Inter", "Georgia", "Courier New", "Impact"];
const PRESETS = [
  { label: "Headline", fontFamily: "Manrope", fontSize: 64, fontStyle: "bold" as const },
  { label: "Subtitle", fontFamily: "Inter", fontSize: 32, fontStyle: "normal" as const },
  { label: "Body", fontFamily: "Inter", fontSize: 18, fontStyle: "normal" as const },
];

export function TextToolPanel() {
  const addObject = useEditorStore((s) => s.addObject);
  const activeSide = useEditorStore((s) => s.activeSide);
  const canvasSize = useEditorStore((s) => s.canvasSize);
  const { locale } = useLanguage();

  const copy = {
    en: {
      title: "Text Tool",
      desc: "Add text elements to the garment canvas.",
      headline: "Headline",
      subtitle: "Subtitle",
      body: "Body",
      content: "Text Content",
      font: "Font",
      size: "Size",
      style: "Style",
      align: "Align",
      color: "Color",
      add: "Add to Canvas",
      placeholder: "Your Text",
    },
    es: {
      title: "Herramienta de texto",
      desc: "Agrega elementos de texto al lienzo de la prenda.",
      headline: "Titular",
      subtitle: "Subtítulo",
      body: "Cuerpo",
      content: "Contenido del texto",
      font: "Fuente",
      size: "Tamaño",
      style: "Estilo",
      align: "Alineación",
      color: "Color",
      add: "Agregar al lienzo",
      placeholder: "Tu texto",
    },
    pt: {
      title: "Ferramenta de texto",
      desc: "Adicione elementos de texto à tela da peça.",
      headline: "Título",
      subtitle: "Subtítulo",
      body: "Corpo",
      content: "Conteúdo do texto",
      font: "Fonte",
      size: "Tamanho",
      style: "Estilo",
      align: "Alinhamento",
      color: "Cor",
      add: "Adicionar à tela",
      placeholder: "Seu texto",
    },
  } as const;

  const [text, setText] = useState<string>(copy[locale].placeholder);
  const [fontFamily, setFontFamily] = useState("Manrope");
  const [fontSize, setFontSize] = useState(48);
  const [fontStyle, setFontStyle] = useState<"normal" | "bold" | "italic" | "bold italic">("bold");
  const [fill, setFill] = useState("#191c1e");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");

  const handleAdd = () => {
    if (!text.trim()) return;
    addObject({
      type: "text",
      side: activeSide,
      name: `Text: ${text.slice(0, 20)}`,
      text,
      fontFamily,
      fontSize,
      fontStyle,
      fill,
      textAlign,
      letterSpacing: 0,
      lineHeight: 1.2,
      textDecoration: "",
      x: canvasSize.width / 2 - 100,
      y: canvasSize.height / 2 - fontSize / 2,
      width: 200,
      height: fontSize * 1.5,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      locked: false,
    });
  };

  return (
    <div className="p-5 flex flex-col gap-5 overflow-y-auto no-scrollbar">
      <div>
        <h3 className="text-xs font-label font-bold text-outline uppercase tracking-widest mb-1">
          {copy[locale].title}
        </h3>
        <p className="text-xs text-on-surface-variant">
          {copy[locale].desc}
        </p>
      </div>

      {/* Presets */}
      <div className="flex gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setFontFamily(p.fontFamily);
              setFontSize(p.fontSize);
              setFontStyle(p.fontStyle);
            }}
            className="flex-1 py-2 text-xs rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors font-medium text-on-surface-variant"
          >
            {p.label === "Headline"
              ? copy[locale].headline
              : p.label === "Subtitle"
                ? copy[locale].subtitle
                : copy[locale].body}
          </button>
        ))}
      </div>

      {/* Text input */}
      <div>
        <label className="text-[10px] font-label font-bold text-outline uppercase tracking-widest block mb-1.5">
          {copy[locale].content}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-3 py-2 text-sm text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition"
        />
      </div>

      {/* Font family */}
      <div>
        <label className="text-[10px] font-label font-bold text-outline uppercase tracking-widest block mb-1.5">
          {copy[locale].font}
        </label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Font size */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-label font-bold text-outline uppercase tracking-widest">
            {copy[locale].size}
          </label>
          <span className="text-xs text-on-surface font-medium">{fontSize}px</span>
        </div>
        <input
          type="range"
          min={10}
          max={200}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {/* Style toggles */}
      <div>
        <label className="text-[10px] font-label font-bold text-outline uppercase tracking-widest block mb-1.5">
          {copy[locale].style}
        </label>
        <div className="flex gap-2">
          {(["normal", "bold", "italic", "bold italic"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFontStyle(s)}
              className={cn(
                "flex-1 py-1.5 text-xs rounded-lg capitalize font-medium transition-colors",
                fontStyle === s
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              {locale === "en"
                ? s
                : locale === "es"
                  ? s === "normal"
                    ? "normal"
                    : s === "bold"
                      ? "negrita"
                      : s === "italic"
                        ? "cursiva"
                        : "negrita cursiva"
                  : s === "normal"
                    ? "normal"
                    : s === "bold"
                      ? "negrito"
                      : s === "italic"
                        ? "itálico"
                        : "negrito itálico"}
            </button>
          ))}
        </div>
      </div>

      {/* Align */}
      <div>
        <label className="text-[10px] font-label font-bold text-outline uppercase tracking-widest block mb-1.5">
          {copy[locale].align}
        </label>
        <div className="flex gap-2">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setTextAlign(a)}
              className={cn(
                "flex-1 py-1.5 text-xs rounded-lg capitalize font-medium transition-colors",
                textAlign === a
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              {locale === "en"
                ? a
                : locale === "es"
                  ? a === "left"
                    ? "izquierda"
                    : a === "center"
                      ? "centro"
                      : "derecha"
                  : a === "left"
                    ? "esquerda"
                    : a === "center"
                      ? "centro"
                      : "direita"}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="text-[10px] font-label font-bold text-outline uppercase tracking-widest block mb-1.5">
          {copy[locale].color}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={fill}
            onChange={(e) => setFill(e.target.value)}
            className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
          />
          <span className="text-sm font-label text-on-surface">{fill.toUpperCase()}</span>
        </div>
      </div>

      <Button variant="primary" size="md" className="w-full mt-auto" onClick={handleAdd}>
        {copy[locale].add}
      </Button>
    </div>
  );
}
