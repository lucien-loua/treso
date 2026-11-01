import { spacing } from "@/theme";

/** Where a row's text starts when it leads with an icon of `iconSize`: separators line up with it. */
export const rowInset = (iconSize = 36) => spacing.md + iconSize + spacing.smd;
