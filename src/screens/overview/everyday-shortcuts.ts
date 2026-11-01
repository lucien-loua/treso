import { DAILY_PRESETS } from "@/data/catalog/profile-presets";
import type { Profile } from "@/data/profile";
import type { Messages } from "@/i18n/messages/fr";
import type { Shortcut } from "@/utils/shortcuts";

/** The day-to-day expenses the user picked, as quick-add shortcuts named in the app's language. */
export const everydayShortcuts = (profile: Profile, t: Messages): Shortcut[] =>
  profile.daily.map((id) => ({
    categoryId: DAILY_PRESETS[id].categoryId,
    color: null,
    icon: DAILY_PRESETS[id].icon,
    note: t.profile.daily[id].name,
  }));
