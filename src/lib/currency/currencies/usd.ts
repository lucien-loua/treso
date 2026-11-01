import { defineCurrency } from "../core/definition";

/** US dollar: cents in use; `Intl` writes "$US" in French. */
export const USD = defineCurrency({ code: "USD" });
