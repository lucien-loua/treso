import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";

import { GroupedSection } from "@/components/ui/grouped-section";
import { ListRow, ListRowText, SeparatedList } from "@/components/ui/list-row";
import { rowInset } from "@/components/ui/row-inset";
import { symbols } from "@/constants/symbols";
import { colors, spacing } from "@/theme";
import { haptics } from "@/utils/haptics";

const CHECK_SIZE = 24;

export interface Choice<Id extends string> {
  id: Id;
  label: string;
  leading?: ReactNode;
}

/** Rows to tick: several at once, or one (`single`) like a currency. */
export const ChoiceList = <Id extends string>({
  title,
  choices,
  selected,
  onToggle,
  single = false,
}: {
  title?: string;
  choices: Choice<Id>[];
  selected: readonly Id[];
  onToggle: (id: Id) => void;
  single?: boolean;
}) => (
  <GroupedSection title={title}>
    <SeparatedList
      data={choices}
      keyExtractor={(choice) => choice.id}
      inset={choices.some((choice) => choice.leading) ? rowInset() : spacing.md}
      renderItem={(choice) => {
        const checked = selected.includes(choice.id);
        return (
          <ListRow
            accessibilityRole={single ? "radio" : "checkbox"}
            accessibilityState={{ checked }}
            onPress={() => {
              haptics.selection();
              onToggle(choice.id);
            }}
          >
            {choice.leading}
            <ListRowText title={choice.label} />
            <SymbolView
              name={checked ? symbols.checkCircle : symbols.circle}
              tintColor={checked ? colors.tint : colors.tertiaryLabel}
              resizeMode="scaleAspectFit"
              size={CHECK_SIZE}
            />
          </ListRow>
        );
      }}
    />
  </GroupedSection>
);

/** `list` with `id` added or removed, in the order of `all`. */
export const toggled = <Id extends string>(
  list: readonly Id[],
  id: Id,
  all: readonly Id[]
): Id[] =>
  all.filter((item) =>
    item === id ? !list.includes(item) : list.includes(item)
  );
