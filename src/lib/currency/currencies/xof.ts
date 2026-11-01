import { defineCurrency } from "../core/definition";

/**
 * West African CFA franc (BCEAO): Côte d’Ivoire, Senegal and the other WAEMU countries.
 * `Intl` knows it whole: no decimals in use, "F CFA" with a no-break space.
 */
export const XOF = defineCurrency({ code: "XOF" });
