import { View } from "react-native";

import { AmountText } from "@/components/amount-text";
import { CategoryIcon } from "@/components/category-icon";
import { GroupedSection } from "@/components/ui/grouped-section";
import { ListRow, SeparatedList } from "@/components/ui/list-row";
import { ProgressBar } from "@/components/ui/progress-bar";
import { rowInset } from "@/components/ui/row-inset";
import { ThemedText } from "@/components/ui/themed-text";
import { getCategory } from "@/data/catalog/categories";
import { categoryColors, radius, spacing } from "@/theme";
import type { CategoryTotal } from "@/utils/stats";

const ICON_SIZE = 32;

const percent = (share: number) => `${Math.round(share * 100)} %`;

/** All categories in one capsule, each segment sized by its share of the month's spending. */
const ShareBar = ({ totals }: { totals: CategoryTotal[] }) => (
  <View
    accessible
    accessibilityLabel={totals
      .map((t) => `${getCategory(t.categoryId).label} ${percent(t.share)}`)
      .join(", ")}
    style={{
      borderRadius: radius.full,
      flexDirection: "row",
      gap: spacing.xxs,
      height: 12,
      margin: spacing.md,
      marginBottom: spacing.sm,
      overflow: "hidden",
    }}
  >
    {totals.map((t) => (
      <View
        key={t.categoryId}
        style={{
          backgroundColor: categoryColors[getCategory(t.categoryId).color],
          flex: t.share,
        }}
      />
    ))}
  </View>
);

const CategoryShareRow = ({
  total,
  currency,
}: {
  total: CategoryTotal;
  currency: string;
}) => {
  const category = getCategory(total.categoryId);
  return (
    <ListRow>
      <CategoryIcon category={category} size={ICON_SIZE} />
      <View style={{ flex: 1, gap: spacing.xs }}>
        <View
          style={{
            alignItems: "baseline",
            flexDirection: "row",
            gap: spacing.sm,
          }}
        >
          <ThemedText variant="body" numberOfLines={1} style={{ flex: 1 }}>
            {category.label}
          </ThemedText>
          <ThemedText
            variant="footnote"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {percent(total.share)}
          </ThemedText>
          <AmountText
            cents={total.totalCents}
            currency={currency}
            style={{ fontWeight: "600" }}
          />
        </View>
        <ProgressBar
          value={total.share}
          color={categoryColors[category.color]}
          height={4}
        />
      </View>
    </ListRow>
  );
};

/** The month's spending: the share bar, then one row per category. */
export const CategoryBreakdown = ({
  totals,
  currency,
}: {
  totals: CategoryTotal[];
  currency: string;
}) => (
  <GroupedSection title="Dépenses par catégorie">
    {totals.length === 0 ? (
      <ThemedText variant="subhead" style={{ padding: spacing.md }}>
        Aucune dépense ce mois-ci.
      </ThemedText>
    ) : (
      <>
        <ShareBar totals={totals} />
        <SeparatedList
          data={totals}
          keyExtractor={(total) => total.categoryId}
          inset={rowInset(ICON_SIZE)}
          renderItem={(total) => (
            <CategoryShareRow total={total} currency={currency} />
          )}
        />
      </>
    )}
  </GroupedSection>
);
