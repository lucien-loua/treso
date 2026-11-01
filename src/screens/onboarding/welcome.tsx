import { router } from "expo-router";

import { useI18n } from "@/i18n/context";

import { ChoiceList } from "./choice-list";
import { useOnboarding } from "./context";
import { StepHeader } from "./step-header";
import { StepScreen } from "./step-screen";

/** First step: what this is about, and the currency (guessed from the phone's region). */
export const WelcomeStep = () => {
  const { t, currencies } = useI18n();
  const { base, mode, draft, update, skip } = useOnboarding();
  const first = mode === "first";
  return (
    <>
      <StepHeader
        cancelLabel={first ? undefined : t.actions.cancel}
        onCancel={first ? undefined : () => router.back()}
        skipLabel={first ? t.onboarding.skip : undefined}
        onSkip={first ? skip : undefined}
      />
      <StepScreen
        title={first ? t.onboarding.welcome.title : t.settings.personalize}
        subtitle={
          first ? t.onboarding.welcome.subtitle : t.settings.personalizeHint
        }
        actionLabel={t.onboarding.continue}
        onAction={() => router.push(`${base}/income`)}
      >
        <ChoiceList
          title={t.onboarding.currency}
          single
          choices={currencies.all.map((currency) => ({
            id: currency.code,
            label: `${t.currencies[currency.code] ?? currency.code} (${currency.symbol})`,
          }))}
          selected={[draft.currency]}
          onToggle={(code) => update({ currency: code })}
        />
      </StepScreen>
    </>
  );
};
