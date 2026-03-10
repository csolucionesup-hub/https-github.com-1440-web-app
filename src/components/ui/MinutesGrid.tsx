import React from "react";
import Card from "./Card";

type MinuteBlockStatus = "free" | "planned" | "executed" | "missed";

interface MinutesGridProps {
  title?: string;
  subtitle?: string;
  blocks?: MinuteBlockStatus[];
}

const blockStyles: Record<MinuteBlockStatus, string> = {
  free: "#1E293B",
  planned: "#4F46E5",
  executed: "#10B981",
  missed: "#EF4444",
};

function buildDemoBlocks(): MinuteBlockStatus[] {
  const totalBlocks = 48; // 48 bloques de 30 min = 1440 min
  const blocks: MinuteBlockStatus[] = [];

  for (let i = 0; i < totalBlocks; i++) {
    if (i < 16) {
      blocks.push("free");
    } else if (i < 26) {
      blocks.push("planned");
    } else if (i < 34) {
      blocks.push("executed");
    } else if (i < 38) {
      blocks.push("missed");
    } else {
      blocks.push("free");
    }
  }

  return blocks;
}

export default function MinutesGrid({
  title = "Mapa de tus 1440 minutos",
  subtitle = "Cada bloque representa 30 minutos de tu día",
  blocks = buildDemoBlocks(),
}: MinutesGridProps) {
  return (
    <Card title={title} subtitle={subtitle}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {blocks.map((block, index) => (
          <div
            key={index}
            title={`${block} · bloque ${index + 1}`}
            style={{
              height: 26,
              borderRadius: 10,
              background: blockStyles[block],
              boxShadow:
                block === "executed"
                  ? "0 0 0 1px rgba(16,185,129,0.25), 0 8px 18px rgba(16,185,129,0.18)"
                  : "none",
              border:
                block === "free"
                  ? "1px solid rgba(255,255,255,0.04)"
                  : "1px solid transparent",
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          fontSize: 13,
          color: "#CBD5E1",
        }}
      >
        <LegendItem label="Libre" color={blockStyles.free} />
        <LegendItem label="Planificado" color={blockStyles.planned} />
        <LegendItem label="Ejecutado" color={blockStyles.executed} />
        <LegendItem label="Perdido / no cumplido" color={blockStyles.missed} />
      </div>
    </Card>
  );
}

function LegendItem({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: color,
          display: "inline-block",
        }}
      />
      <span>{label}</span>
    </div>
  );
}
