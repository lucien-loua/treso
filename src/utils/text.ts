/** Lowercase without accents, for matching: « Santé » and « sante » compare equal. */
export const foldText = (value: string) =>
  value.normalize("NFD").replaceAll(/\p{M}/gu, "").toLowerCase();
