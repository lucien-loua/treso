import { CategoryIcon } from "@/components/category-icon";
import { getCategory } from "@/data/catalog/categories";
import type { CategoryId } from "@/data/catalog/categories";
import type { IconId } from "@/data/catalog/icons";

/** The icon an answer will have in the app: its category's color, its own glyph. */
export const PresetIcon = ({
  categoryId,
  icon,
}: {
  categoryId: CategoryId;
  icon: IconId | null;
}) => <CategoryIcon category={getCategory(categoryId)} iconId={icon} />;
