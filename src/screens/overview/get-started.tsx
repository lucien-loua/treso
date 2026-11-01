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
import type { Schedule, Transaction } from "@/data/types";
import { colors } from "@/theme";
import { haptics } from "@/utils/haptics";

import { getStartedSteps } from "./get-started-steps";

/** First-run checklist: each step opens a prefilled form, and ticks itself once done. */
export const GetStarted = ({
  schedules,
  transactions,
  onHide,
}: {
  schedules: Schedule[];
  transactions: Transaction[];
  onHide?: () => void;
}) => (
  <GroupedSection
    title="Bien démarrer"
    accessory={onHide ? <TextButton label="Masquer" onPress={onHide} /> : null}
    footer="Vous pourrez tout modifier ensuite : montants, jours, noms."
  >
    <SeparatedList
      data={getStartedSteps(schedules, transactions)}
      keyExtractor={(step) => step.key}
      renderItem={(step) => (
        <ListRow
          accessibilityState={{ checked: step.done }}
          onPress={() => {
            haptics.selection();
            router.push(step.href);
          }}
        >
          <CategoryIcon category={getCategory(step.categoryId)} />
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
              style={{ height: 22, width: 22 }}
            />
          ) : (
            <ListRowChevron />
          )}
        </ListRow>
      )}
    />
  </GroupedSection>
);
