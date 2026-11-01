import { router } from "expo-router";

import { DAILY_PRESETS } from "@/data/catalog/profile-presets";
import { DAILY_EXPENSES } from "@/data/profile";
import { useI18n } from "@/i18n/context";

import { ChoiceList, toggled } from "./choice-list";
import { useOnboarding } from "./context";
import { PresetIcon } from "./preset-icon";
import { StepScreen } from "./step-screen";

/** Day-to-day spending: each one becomes a quick-add shortcut on the Overview. */
export const DailyStep = () => {
  const { t } = useI18n();
  const { base, draft, update } = useOnboarding();
  const { daily } = draft.profile;

  return (
    <StepScreen
      title={t.onboarding.daily.title}
      subtitle={t.onboarding.daily.subtitle}
      actionLabel={t.onboarding.continue}
      onAction={() => router.push(`${base}/budget`)}
    >
      <ChoiceList
        choices={DAILY_EXPENSES.map((id) => ({
          id,
          label: t.profile.daily[id].label,
          leading: (
            <PresetIcon
              categoryId={DAILY_PRESETS[id].categoryId}
              icon={DAILY_PRESETS[id].icon}
            />
          ),
        }))}
        selected={daily}
        onToggle={(id) =>
          update({
            profile: {
              ...draft.profile,
              daily: toggled(daily, id, DAILY_EXPENSES),
            },
          })
        }
      />
    </StepScreen>
  );
};
