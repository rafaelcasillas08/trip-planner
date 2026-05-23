/** "2026-06-01" → "Lun. 1 jun" */
export function formatDateShort(d: string): string {
  if (!d) return d;
  const date = new Date(`${d}T00:00:00`);
  const weekday = new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
  }).format(date);
  const dayMonth = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  }).format(date);
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1, 3)}. ${dayMonth}`;
}

/** "2026-06-01" → "Lunes, 1 de junio" */
export function formatDateLabel(d: string): string {
  if (!d) return d;
  const date = new Date(`${d}T00:00:00`);
  const formatted = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
