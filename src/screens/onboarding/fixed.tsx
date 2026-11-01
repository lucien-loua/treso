import { router } from "expo-router";

import { FIXED_PRESETS } from "@/data/catalog/profile-presets";
import { FIXED_EXPENSES } from "@/data/profile";
import { useI18n } from "@/i18n/context";

import { ChoiceList, toggled } from "./choice-list";
import { useOnboarding } from "./context";
import { PresetIcon } from "./preset-icon";
import { StepScreen } from "./step-screen";

/** What is paid every month: each one becomes a step to set up, then a monthly reminder. */
export const FixedStep = () => {
  const { t } = useI18n();
  const { base, draft, update } = useOnboarding();
  const { fixed } = draft.profile;

  return (
    <StepScreen
      title={t.onboarding.fixed.title}
      subtitle={t.onboarding.fixed.subtitle}
      actionLabel={t.onboarding.continue}
      onAction={() => router.push(`${base}/daily`)}
    >
      <ChoiceList
        choices={FIXED_EXPENSES.map((id) => ({
          id,
          label: t.profile.fixed[id].label,
          leading: (
            <PresetIcon
              categoryId={FIXED_PRESETS[id].categoryId}
              icon={FIXED_PRESETS[id].icon}
            />
          ),
        }))}
        selected={fixed}
        onToggle={(id) =>
          update({
            profile: {
              ...draft.profile,
              fixed: toggled(fixed, id, FIXED_EXPENSES),
            },
          })
        }
      />
    </StepScreen>
  );
};
