import { useState } from "react";
import { View } from "react-native";

import { AmountText } from "@/components/amount-text";
import { CategoryIcon } from "@/components/category-icon";
import { GroupedSection } from "@/components/ui/grouped-section";
import { ListRow, SeparatedList } from "@/components/ui/list-row";
import { ProgressBar } from "@/components/ui/progress-bar";
import { rowInset } from "@/components/ui/row-inset";
import { TextButton } from "@/components/ui/text-button";
import { ThemedText } from "@/components/ui/themed-text";
import { getCategory } from "@/data/catalog/categories";
import { useI18n } from "@/i18n/context";
import { categoryColors, radius, spacing } from "@/theme";
import type { CategoryTotal } from "@/utils/stats";

const ICON_SIZE = 32;
/** Categories listed before "See all": the bar above already shows every one. */
const TOP_COUNT = 3;

/** All categories in one capsule, each segment sized by its share of the month's spending. */
const ShareBar = ({ totals }: { totals: CategoryTotal[] }) => {
  const { t, percent } = useI18n();
  return (
    <View
      accessible
      accessibilityLabel={totals
        .map(
          (total) =>
            `${t.categories[getCategory(total.categoryId).id]} ${percent(total.share)}`
        )
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
      {totals.map((total) => (
        <View
          key={total.categoryId}
          style={{
            backgroundColor:
              categoryColors[getCategory(total.categoryId).color],
            flex: total.share,
          }}
        />
      ))}
    </View>
  );
};

const CategoryShareRow = ({ total }: { total: CategoryTotal }) => {
  const { t, percent } = useI18n();
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
            {t.categories[category.id]}
          </ThemedText>
          <ThemedText
            variant="footnote"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {percent(total.share)}
          </ThemedText>
          <AmountText cents={total.totalCents} style={{ fontWeight: "600" }} />
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
export const CategoryBreakdown = ({ totals }: { totals: CategoryTotal[] }) => {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const hasMore = totals.length > TOP_COUNT;
  return (
    <GroupedSection
      title={t.overview.byCategory.title}
      accessory={
        hasMore ? (
          <TextButton
            label={expanded ? t.actions.seeLess : t.actions.seeAll}
            onPress={() => setExpanded((open) => !open)}
          />
        ) : null
      }
    >
      {totals.length === 0 ? (
        <ThemedText variant="subhead" style={{ padding: spacing.md }}>
          {t.overview.byCategory.none}
        </ThemedText>
      ) : (
        <>
          <ShareBar totals={totals} />
          <SeparatedList
            data={expanded ? totals : totals.slice(0, TOP_COUNT)}
            keyExtractor={(total) => total.categoryId}
            inset={rowInset(ICON_SIZE)}
            renderItem={(total) => <CategoryShareRow total={total} />}
          />
        </>
      )}
    </GroupedSection>
  );
};
