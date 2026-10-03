export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const DIFF_META: Record<
  string,
  { label: string; text: string; dot: string; ring: string; xp: number }
> = {
  easy: {
    label: "Easy",
    text: "text-[#7ee787]",
    dot: "bg-[#7ee787]",
    ring: "border-[#7ee787]/30",
    xp: 50,
  },
  medium: {
    label: "Medium",
    text: "text-[#ffd866]",
    dot: "bg-[#ffd866]",
    ring: "border-[#ffd866]/30",
    xp: 150,
  },
  hard: {
    label: "Hard",
    text: "text-[#ff7b72]",
    dot: "bg-[#ff7b72]",
    ring: "border-[#ff7b72]/30",
    xp: 300,
  },
  expert: {
    label: "Expert",
    text: "text-[#c4a7ff]",
    dot: "bg-[#c4a7ff]",
    ring: "border-[#c4a7ff]/30",
    xp: 500,
  },
};

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
