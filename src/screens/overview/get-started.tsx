import { router } from "expo-router";
import { SymbolView } from "expo-symbols";

import { CategoryIcon } from "@/components/category-icon";
import { GroupedSection } from "@/components/ui/grouped-section";
import {
  ListRow,
  ListRowChevron,
  ListRowText,
  SeparatedList,
} from "@/components/ui/list-row";
import { TextButton } from "@/components/ui/text-button";
import { symbols } from "@/constants/symbols";
import { getCategory } from "@/data/catalog/categories";
import type { Profile } from "@/data/profile";
import type { Schedule, Transaction } from "@/data/types";
import { useI18n } from "@/i18n/context";
import { colors } from "@/theme";
import { haptics } from "@/utils/haptics";

import { getStartedSteps } from "./get-started-steps";

/** What to set up first, from the user's profile: each step opens a prefilled form and ticks itself once done. */
export const GetStarted = ({
  profile,
  schedules,
  transactions,
  onHide,
}: {
  profile: Profile;
  schedules: Schedule[];
  transactions: Transaction[];
  onHide: () => void;
}) => {
  const { t } = useI18n();
  return (
    <GroupedSection
      title={t.overview.getStarted.title}
      accessory={<TextButton label={t.actions.hide} onPress={onHide} />}
    >
      <SeparatedList
        data={getStartedSteps(profile, { schedules, transactions }, t)}
        keyExtractor={(step) => step.key}
        renderItem={(step) => (
          <ListRow
            accessibilityState={{ checked: step.done }}
            onPress={() => {
              haptics.selection();
              router.push(step.href);
            }}
          >
            <CategoryIcon
              category={getCategory(step.categoryId)}
              iconId={step.icon}
            />
            <ListRowText
              title={step.title}
              titleColor={step.done ? colors.secondaryLabel : undefined}
              subtitle={step.hint}
            />
            {step.done ? (
              <SymbolView
                name={symbols.checkCircle}
                tintColor={colors.income}
                resizeMode="scaleAspectFit"
                size={22}
              />
            ) : (
              <ListRowChevron />
            )}
          </ListRow>
        )}
      />
    </GroupedSection>
  );
};
