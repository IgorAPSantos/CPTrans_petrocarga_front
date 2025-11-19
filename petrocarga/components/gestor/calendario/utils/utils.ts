export const toDateKey = (iso: string) => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const dayStartISO = (dateKey: string) => `${dateKey}T00:00:00.000Z`;

export const formatTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

export const areaColors: Record<string, string> = {
  VERMELHA: "#ef4444",
  AMARELA: "#facc15",
  AZUL: "#3b82f6",
  BRANCA: "#e5e7eb",
  DEFAULT: "#6b7280",
};

export function getColorByArea(area?: string) {
  if (!area) return areaColors.DEFAULT;
  return areaColors[area.toUpperCase()] ?? areaColors.DEFAULT;
}
