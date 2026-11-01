import type { SymbolViewProps } from "expo-symbols";

type SymbolSpec = Exclude<SymbolViewProps["name"], string>;

// SF Symbol on iOS, Material Symbol on Android and web. Typed so misspelled names fail the typecheck.
const symbol = (
  ios: NonNullable<SymbolSpec["ios"]>,
  android: NonNullable<SymbolSpec["android"]>
): SymbolViewProps["name"] => ({ android, ios, web: android });

/** Interface glyphs used in several places. Category and transaction icons live in `@/data/catalog`. */
export const symbols = {
  add: symbol("plus", "add"),
  arrowDown: symbol("arrow.down", "arrow_downward"),
  arrowUp: symbol("arrow.up", "arrow_upward"),
  check: symbol("checkmark", "check"),
  checkCircle: symbol("checkmark.circle.fill", "check_circle"),
  chevronLeft: symbol("chevron.left", "chevron_left"),
  chevronRight: symbol("chevron.right", "chevron_right"),
  edit: symbol("pencil.circle.fill", "edit"),
  empty: symbol("tray", "inbox"),
  help: symbol("questionmark.circle", "help"),
  search: symbol("magnifyingglass", "search"),
  warning: symbol("exclamationmark.triangle", "warning"),
};
