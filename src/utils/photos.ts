const GITHUB_BASE = "https://raw.githubusercontent.com/TU_USUARIO/trip-planner/main/src/data/photos";

function isLocalHost(): boolean {
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1";
}

export function resolvePhotoUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (isLocalHost()) return `/photos/${path}`;
  return `${GITHUB_BASE.replace(/\/$/, "")}/${path}`;
}
