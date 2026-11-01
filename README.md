# Treso

Treso is a personal finance app for Android and iOS: track your income, your expenses and what you have left, today and at the end of the month. It is built for everyday life in West Africa (CFA franc, Guinean franc, US dollar) and speaks French and English, following the phone's language.

Private by design: no account, no server, no tracking. Your data stays on your phone.

## Features

- **Built around you.** A one-minute first launch asks where your money comes from, what you pay every month and what you spend on day to day; the app then only suggests what applies to you. Change it anytime in Settings.
- **Monthly overview.** Current balance, what this month added, the expected end-of-month balance, spending by category and an optional budget.
- **Recurring items.** Salary around the 26th, rent by the 5th, bills by the 3rd: Treso keeps track of them under "Upcoming", and you confirm with one tap when they're paid or received.
- **Quick add.** Everyday expenses (transport, meals…) in one tap; when you type a name, the category is guessed ("Taxi" is transport).
- **Several currencies.** Each amount keeps the currency it was entered in; switching currency converts at the day's rates (downloaded daily, or your own).
- **Your data, your files.** Export a full backup and import it on this phone or another, or export a spreadsheet (CSV) for Excel or Google Sheets.

## Privacy

Everything is stored on the device (SQLite). The only network request downloads public exchange rates once a day. See [PRIVACY.md](PRIVACY.md).

## Tech

[Expo](https://expo.dev) SDK 58 · React Native · Expo Router (native tabs and stacks) · `@expo/ui` (SwiftUI and Jetpack Compose) · expo-sqlite · expo-localization · TypeScript with the React Compiler · [Ultracite](https://www.ultracite.ai) (Oxlint + Oxfmt) · [bun](https://bun.sh).

## Getting started

```bash
bun install
bun start
```

Then open the app in [Expo Go](https://expo.dev/go), an Android emulator or the iOS simulator.

| Command             | What it does                      |
| ------------------- | --------------------------------- |
| `bun start`         | Start the dev server              |
| `bun run check`     | Lint and format check             |
| `bun run fix`       | Fix lint and formatting           |
| `bun run typecheck` | Type-check                        |
| `bun run doctor`    | Check dependencies and app config |

The code layout and conventions are described in [AGENTS.md](AGENTS.md).

## Release

Builds and store submissions go through [EAS](https://docs.expo.dev/eas/). The app identifier is `com.lucienloua.treso` on both stores; version numbers are managed by EAS (`appVersionSource: remote`).

```bash
bunx eas-cli login
bunx eas-cli init                                        # once: links the project to your Expo account

bunx eas-cli build -p android --profile preview          # APK to install on test phones
bunx eas-cli build -p android --profile production       # AAB for Google Play
bunx eas-cli submit -p android --latest                  # upload to the internal testing track
bunx eas-cli build -p ios --profile production --auto-submit
```

Android submission needs a Google Play service account key at `./google-service-account.json` (ignored by git). Store listing texts and graphics live in [`fastlane/metadata/android`](fastlane/metadata/android) (Google Play) and [`store.config.json`](store.config.json) (App Store, pushed with `bunx eas-cli metadata:push`). Play Console declarations and the first-release steps are in [docs/google-play.md](docs/google-play.md).

## License

[MIT](LICENSE) © 2026 Lucien Loua
