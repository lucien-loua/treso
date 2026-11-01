import type { Transaction } from "@/data/types";
import { toISODate } from "@/lib/datetime";

export interface Shortcut {
  categoryId: string;
  note: string;
  icon: string | null;
  color: string | null;
}

/**
 * The expenses the user enters most often over the last 60 days (same category, name and icon),
 * topped up with `everyday` (what they said they spend on day to day) while there are few.
 * Scheduled payments are left out: they have their own "Pay" button.
 */
export const frequentExpenses = (
  transactions: Transaction[],
  everyday: Shortcut[],
  max = 4,
  today = new Date()
): Shortcut[] => {
  const since = toISODate(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 60)
  );
  const counts = new Map<
    string,
    { shortcut: Shortcut; count: number; last: string }
  >();

  for (const t of transactions) {
    if (t.type !== "expense" || t.scheduleId !== null || t.date < since) {
      continue;
    }
    const key = `${t.categoryId}|${t.note.toLowerCase()}|${t.icon ?? ""}|${t.color ?? ""}`;
    const entry = counts.get(key);
    if (entry) {
      entry.count += 1;
    } else {
      counts.set(key, {
        count: 1,
        last: t.date,
        shortcut: {
          categoryId: t.categoryId,
          color: t.color,
          icon: t.icon,
          note: t.note,
        },
      });
    }
  }

  const result = [...counts.values()]
    .sort((a, b) => b.count - a.count || b.last.localeCompare(a.last))
    .map((entry) => entry.shortcut)
    .slice(0, max);

  for (const shortcut of everyday) {
    if (result.length >= max) {
      break;
    }
    // A frequent « Taxi » already covers « Transport », not « Fuel » with its own icon
    const covered = result.some(
      (s) =>
        s.categoryId === shortcut.categoryId &&
        (shortcut.icon === null || s.icon === shortcut.icon)
    );
    if (!covered) {
      result.push(shortcut);
    }
  }
  return result;
};
