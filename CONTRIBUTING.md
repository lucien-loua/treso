# Contributing to Treso

Thanks for your interest in Treso. Bug reports, translations and fixes are all welcome.

## Before you start

- For anything bigger than a small fix, open an issue first, so we agree on the approach before you write code.
- Treso makes one promise: no account, no server, no ads, no tracking, and the user's data stays on their phone. Changes that send user data off the device won't be merged. A new network request or permission needs a clear reason, and updates to [PRIVACY.md](PRIVACY.md) and the store declarations in [RELEASING.md](RELEASING.md).

## Set up

You need [Bun](https://bun.sh). For a development build, set up Android Studio and Java, or Xcode, with [Expo's guide](https://docs.expo.dev/get-started/set-up-your-environment/).

```bash
bun install
bun run android    # or bun run ios: builds a development build and starts the dev server
```

Afterwards, `bun start` is enough. Build again only after adding a native library, changing `app.json` or upgrading the Expo SDK. Without Android Studio or Xcode, `bunx expo start --go` runs the app in [Expo Go](https://expo.dev/go): every feature works there, but not the native setup (icon, permissions, per-app language).

Use `bun` and `bunx`, never npm or npx. Add a package with `bunx expo install <package>`, so its version matches the Expo SDK.

## Conventions

[AGENTS.md](AGENTS.md) describes the project layout and the rules the code follows. The ones that come up most:

- No user-facing text in code: every label, title, alert and accessibility string comes from `t`. Add the key to `src/i18n/messages/fr.ts` (the reference), then to every other language.
- Amounts go through `useMoney()`, dates through `useI18n()` and calendar math through `@/lib/datetime`. Never call `toLocaleString` or `Intl` in a screen.
- Colors, spacing and type styles come from `src/theme`. Reuse the building blocks in `src/components/ui` before writing new UI.
- A schema change is a new migration in `src/data/db/migrations`. Never edit a migration that has shipped.

## Before opening a pull request

```bash
bun run check       # lint and format; bun run fix repairs most issues
bun run typecheck
bun run doctor      # when you change dependencies or app.json
```

CI runs the same checks on every pull request. For a UI change, test on Android and iOS if you can, and add screenshots to the pull request.

## Translations

Treso speaks French and English. To add a language:

1. Copy `src/i18n/messages/en.ts` to `src/i18n/messages/<code>.ts` and translate it. TypeScript reports any missing key.
2. Add it to `MESSAGES` in `src/i18n/i18n.ts`, and to `supportedLocales` in `app.json`.
3. Optionally, translate the store listing in `fastlane/metadata/android/<locale>/`.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
