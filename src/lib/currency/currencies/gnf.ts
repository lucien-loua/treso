import { defineCurrency } from "../core/definition";

/** Guinean franc: no decimals in use. People write "FG", which `Intl` writes "GNF". */
export const GNF = defineCurrency({
  code: "GNF",
  symbol: "FG",
});
