/**
 * Review Page — LEAD Design Clothes
 * Route: /studio/[garmentId]/review
 *
 * Final side-by-side preview with print readiness checks and export CTA.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { use } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type Konva from "konva";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { GARMENTS } from "@/lib/data/garments";
import { TopBar } from "@/components/ui/TopBar";
import { Button } from "@/components/ui/Button";
import { ExportModal } from "@/components/editor/ExportModal";
import { cn } from "@/lib/utils/cn";
import { useLanguage } from "@/components/providers/LanguageProvider";

// Dynamic import (no SSR) for Konva canvas
const EditorCanvas = dynamic(
  () =>
    import("@/components/editor/EditorCanvas").then((m) => m.EditorCanvas),
  { ssr: false }
);

interface PageProps {
  params: Promise<{ garmentId: string }>;
}

interface Check {
  id: string;
  label: string;
  pass: boolean;
  detail: string;
}

export default function ReviewPage({ params }: PageProps) {
  const { garmentId } = use(params);

  const garment = useEditorStore((s) => s.garment);
  const setGarment = useEditorStore((s) => s.setGarment);
  const setActiveSide = useEditorStore((s) => s.setActiveSide);
  const objects = useEditorStore((s) => s.objects);
  const { t, locale } = useLanguage();

  const [showExport, setShowExport] = useState(false);

  const frontStageRef = useRef<Konva.Stage | null>(null);
  const backStageRef = useRef<Konva.Stage | null>(null);

  useEffect(() => {
    const found = GARMENTS.find((g) => g.id === garmentId);
    if (found && !garment) setGarment(found);
  }, [garmentId, garment, setGarment]);

  const frontObjects = objects.filter((o) => o.side === "front");
  const backObjects = objects.filter((o) => o.side === "back");

  const checks: Check[] = [
    {
      id: "designs-present",
      label: locale === "es" ? "Elementos de diseño presentes" : locale === "pt" ? "Elementos de design presentes" : "Design Elements Present",
      pass: objects.length > 0,
      detail:
        objects.length > 0
          ? locale === "es"
            ? `${objects.length} objeto${objects.length > 1 ? "s" : ""} colocado${objects.length > 1 ? "s" : ""}`
            : locale === "pt"
              ? `${objects.length} objeto${objects.length > 1 ? "s" : ""} colocado${objects.length > 1 ? "s" : ""}`
              : `${objects.length} object${objects.length > 1 ? "s" : ""} placed`
          : locale === "es"
            ? "No se encontraron objetos de diseño"
            : locale === "pt"
              ? "Nenhum objeto de design encontrado"
              : "No design objects found",
    },
    {
      id: "front-design",
      label: locale === "es" ? "Frente diseñado" : locale === "pt" ? "Frente desenhada" : "Front Side Designed",
      pass: frontObjects.length > 0,
      detail:
        frontObjects.length > 0
          ? locale === "es"
            ? `${frontObjects.length} objeto${frontObjects.length > 1 ? "s" : ""} en el frente`
            : locale === "pt"
              ? `${frontObjects.length} objeto${frontObjects.length > 1 ? "s" : ""} na frente`
              : `${frontObjects.length} object${frontObjects.length > 1 ? "s" : ""} on front`
          : locale === "es"
            ? "El frente está vacío"
            : locale === "pt"
              ? "A frente está vazia"
              : "Front side is empty",
    },
    {
      id: "back-design",
      label: locale === "es" ? "Espalda revisada" : locale === "pt" ? "Costas revisadas" : "Back Side Reviewed",
      pass: true, // Back can be intentionally blank
      detail:
        backObjects.length > 0
          ? locale === "es"
            ? `${backObjects.length} objeto${backObjects.length > 1 ? "s" : ""} en la espalda`
            : locale === "pt"
              ? `${backObjects.length} objeto${backObjects.length > 1 ? "s" : ""} nas costas`
              : `${backObjects.length} object${backObjects.length > 1 ? "s" : ""} on back`
          : locale === "es"
            ? "La espalda está intencionalmente vacía"
            : locale === "pt"
              ? "As costas estão intencionalmente vazias"
              : "Back side intentionally blank",
    },
    {
      id: "opacity",
      label: locale === "es" ? "Sin objetos invisibles" : locale === "pt" ? "Sem objetos invisíveis" : "No Invisible Objects",
      pass: objects.every((o) => o.opacity > 0.05),
      detail:
        objects.some((o) => o.opacity <= 0.05)
          ? locale === "es"
            ? "Algunos objetos tienen opacidad muy baja"
            : locale === "pt"
              ? "Alguns objetos têm opacidade muito baixa"
              : "Some objects have very low opacity"
          : locale === "es"
            ? "Todos los objetos son visibles"
            : locale === "pt"
              ? "Todos os objetos estão visíveis"
              : "All objects visible",
    },
    {
      id: "locked",
      label: locale === "es" ? "Sin objetos bloqueados" : locale === "pt" ? "Sem objetos bloqueados" : "No Locked Objects",
      pass: objects.every((o) => !o.locked),
      detail: objects.some((o) => o.locked)
        ? locale === "es"
          ? "Algunos objetos están bloqueados - desbloquéalos antes de exportar"
          : locale === "pt"
            ? "Alguns objetos estão bloqueados - desbloqueie-os antes de exportar"
            : "Some objects are locked - unlock before exporting"
        : locale === "es"
          ? "Todos los objetos están desbloqueados"
          : locale === "pt"
            ? "Todos os objetos estão desbloqueados"
            : "All objects unlocked",
    },
  ];

  const allPass = checks.every((c) => c.pass);

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        title={t("topbar.review")}
        subtitle={t("topbar.finalStep")}
        actions={
          <div className="flex items-center gap-3">
            <Link href={`/studio/${garmentId}`}>
              <Button variant="ghost" size="sm">
                {t("review.backToEditor")}
              </Button>
            </Link>
            <Button
              variant="key-action"
              size="sm"
              onClick={() => setShowExport(true)}
            >
              {t("review.export")}
            </Button>
          </div>
        }
      />

      <div className="pt-20 pb-16 px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-extrabold tracking-tight">
            {locale === "es" ? "Revisión final" : locale === "pt" ? "Revisão final" : "Final Review"}
          </h1>
          <p className="text-outline mt-1">
            {locale === "es"
              ? "Revisa tu diseño en ambos lados antes de exportar."
              : locale === "pt"
                ? "Verifique seu design nos dois lados antes de exportar."
                : "Check your design on both sides before exporting."}
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Left: previews */}
          <div className="flex flex-col gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Front preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-headline font-bold">{t("side.front")}</h2>
                  <span className="text-[10px] font-label font-bold text-outline uppercase tracking-widest">
                    {locale === "es"
                      ? `${frontObjects.length} objeto${frontObjects.length !== 1 ? "s" : ""}`
                      : locale === "pt"
                        ? `${frontObjects.length} objeto${frontObjects.length !== 1 ? "s" : ""}`
                        : `${frontObjects.length} object${frontObjects.length !== 1 ? "s" : ""}`}
                  </span>
                </div>
                <div
                  className="rounded-2xl overflow-hidden ambient-shadow bg-surface-container cursor-pointer"
                  onClick={() => setActiveSide("front")}
                >
                  <EditorCanvas stageRef={frontStageRef} forceSide="front" readOnly />
                </div>
              </div>

              {/* Back preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-headline font-bold">{t("side.back")}</h2>
                  <span className="text-[10px] font-label font-bold text-outline uppercase tracking-widest">
                    {locale === "es"
                      ? `${backObjects.length} objeto${backObjects.length !== 1 ? "s" : ""}`
                      : locale === "pt"
                        ? `${backObjects.length} objeto${backObjects.length !== 1 ? "s" : ""}`
                        : `${backObjects.length} object${backObjects.length !== 1 ? "s" : ""}`}
                  </span>
                </div>
                <div
                  className="rounded-2xl overflow-hidden ambient-shadow bg-surface-container cursor-pointer"
                  onClick={() => setActiveSide("back")}
                >
                  <EditorCanvas stageRef={backStageRef} forceSide="back" readOnly />
                </div>
              </div>
            </div>
          </div>

          {/* Right: sidebar */}
          <div className="flex flex-col gap-6">
            {/* Print readiness */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline font-bold text-sm">
                  {locale === "es" ? "Preparación para impresión" : locale === "pt" ? "Pronto para impressão" : "Print Readiness"}
                </h3>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full font-label uppercase tracking-wide",
                    allPass
                      ? "bg-tertiary-fixed text-on-tertiary-fixed"
                      : "bg-error-container text-on-error-container"
                  )}
                >
                  {allPass
                    ? locale === "es"
                      ? "Listo"
                      : locale === "pt"
                        ? "Pronto"
                        : "Ready"
                    : locale === "es"
                      ? "Problemas encontrados"
                      : locale === "pt"
                        ? "Problemas encontrados"
                        : "Issues Found"}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {checks.map((check) => (
                  <div key={check.id} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                        check.pass ? "bg-tertiary-fixed" : "bg-error-container"
                      )}
                    >
                      {check.pass ? (
                        <svg
                          className="w-3 h-3 text-on-tertiary-fixed"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-3 h-3 text-on-error-container"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-on-surface">
                        {check.label}
                      </p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">
                        {check.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Garment specs */}
            {garment && (
              <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
                <h3 className="font-headline font-bold text-sm mb-4">
                  {locale === "es" ? "Especificaciones de la prenda" : locale === "pt" ? "Especificações da peça" : "Garment Specs"}
                </h3>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: locale === "es" ? "Prenda" : locale === "pt" ? "Peça" : "Garment", value: garment.name },
                    { label: locale === "es" ? "Categoría" : locale === "pt" ? "Categoria" : "Category", value: garment.category },
                    {
                      label: locale === "es" ? "Áreas de impresión" : locale === "pt" ? "Áreas de impressão" : "Print Areas",
                      value:
                        locale === "es"
                          ? `${garment.printAreas} área${garment.printAreas > 1 ? "s" : ""}`
                          : locale === "pt"
                            ? `${garment.printAreas} área${garment.printAreas > 1 ? "s" : ""}`
                            : `${garment.printAreas} area${garment.printAreas > 1 ? "s" : ""}`,
                    },
                    {
                      label: locale === "es" ? "Colores" : locale === "pt" ? "Cores" : "Colors",
                      value:
                        locale === "es"
                          ? `${garment.colors.length} variantes`
                          : locale === "pt"
                            ? `${garment.colors.length} variantes`
                            : `${garment.colors.length} variants`,
                    },
                    {
                      label: locale === "es" ? "Objetos frontales" : locale === "pt" ? "Objetos da frente" : "Front Objects",
                      value: `${frontObjects.length}`,
                    },
                    {
                      label: locale === "es" ? "Objetos traseros" : locale === "pt" ? "Objetos das costas" : "Back Objects",
                      value: `${backObjects.length}`,
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-1.5 border-b border-outline-variant/10 last:border-0">
                      <span className="text-[10px] font-label font-bold text-outline uppercase tracking-widest">
                        {label}
                      </span>
                      <span className="text-xs font-medium text-on-surface capitalize">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export CTA */}
            <Button
              variant="key-action"
              size="lg"
              className="w-full"
              onClick={() => setShowExport(true)}
            >
              {locale === "es" ? "Exportar renders" : locale === "pt" ? "Exportar renders" : "Export Renders"}
            </Button>
            <Link href={`/studio/${garmentId}`}>
              <Button variant="secondary" size="md" className="w-full">
                {t("review.backToEditor")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Export modal */}
      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          frontStageRef={frontStageRef}
          backStageRef={backStageRef}
          garmentName={garment?.name ?? "Garment"}
        />
      )}
    </div>
  );
}
