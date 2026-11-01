import { router } from "expo-router";

import { INCOME_PRESETS } from "@/data/catalog/profile-presets";
import { INCOME_SOURCES } from "@/data/profile";
import { useI18n } from "@/i18n/context";

import { ChoiceList, toggled } from "./choice-list";
import { useOnboarding } from "./context";
import { PresetIcon } from "./preset-icon";
import { StepScreen } from "./step-screen";

/** Picked alone: no regular income (student, between jobs…). */
const NONE = "none";

/** Where the money comes from: a salary becomes a monthly reminder, the rest is noted as it comes. */
export const IncomeStep = () => {
  const { t } = useI18n();
  const { base, draft, update } = useOnboarding();
  const { income } = draft.profile;

  return (
    <StepScreen
      title={t.onboarding.income.title}
      subtitle={t.onboarding.income.subtitle}
      actionLabel={t.onboarding.continue}
      onAction={() => router.push(`${base}/fixed`)}
    >
      <ChoiceList
        choices={[
          ...INCOME_SOURCES.map((id) => ({
            id,
            label: t.profile.income[id].label,
            leading: (
              <PresetIcon
                categoryId={INCOME_PRESETS[id].categoryId}
                icon={INCOME_PRESETS[id].icon}
              />
            ),
          })),
          {
            id: NONE,
            label: t.onboarding.income.none,
            leading: <PresetIcon categoryId="other-income" icon="sparkles" />,
          },
        ]}
        selected={draft.noIncome ? [NONE] : income}
        onToggle={(id) => {
          // « No regular income » and the sources exclude each other
          if (id === NONE) {
            update({
              noIncome: !draft.noIncome,
              profile: { ...draft.profile, income: [] },
            });
            return;
          }
          update({
            noIncome: false,
            profile: {
              ...draft.profile,
              income: toggled(income, id, INCOME_SOURCES),
            },
          });
        }}
      />
    </StepScreen>
  );
};
