// Preloaded by `bun test` (see bunfig.toml): removes what Hermes, React Native's JS engine, doesn't
// have, so tests take the fallbacks phones take. `FULL_INTL=1 bun test` keeps the native paths.
if (!process.env.FULL_INTL) {
  delete (Intl.NumberFormat.prototype as { formatToParts?: unknown })
    .formatToParts;
  delete (Intl as { RelativeTimeFormat?: unknown }).RelativeTimeFormat;
}
