# Releasing Treso

For maintainers. Builds, signing and store submissions go through [EAS](https://docs.expo.dev/eas/). The EAS project belongs to the maintainer's Expo account (`owner` and `extra.eas.projectId` in `app.json`). To build a fork on your own account, remove those two fields and run `bunx eas-cli init`.

## Versions

- Bump `version` in `app.json` for each release. Settings › About shows it.
- EAS manages build numbers (Android `versionCode`, iOS `buildNumber`): `appVersionSource` is `remote`, and the production profile increments them.
- The app identifier `com.lucienloua.treso` (Android package and iOS bundle ID) never changes once published.

## Build profiles

| Profile (`eas.json`) | What it builds |
| --- | --- |
| `development` | Development build for your phone: install it once, then `bun start` serves the code to it |
| `development-simulator` | The same development build, for the iOS Simulator |
| `preview` | Release-like APK to install on test phones |
| `production` | AAB and IPA for the stores |

```bash
bunx eas-cli login
bunx eas-cli build -p android --profile development      # development build for an Android phone
bunx eas-cli build -p android --profile preview          # APK to install on test phones
bunx eas-cli build -p android --profile production       # AAB for Google Play
bunx eas-cli submit -p android --latest                  # upload to the internal testing track, as a draft
bunx eas-cli build -p ios --profile production --auto-submit
```

## Store listings

- **Google Play:** texts and graphics in [`fastlane/metadata/android/<locale>/`](fastlane/metadata/android), pasted into the Play Console. The default language is French (`fr-FR`); English (`en-US`) is a translation with its own graphics.
- **App Store:** [`store.config.json`](store.config.json), pushed with `bunx eas-cli metadata:push`.

Keep the listings, `README.md`, `PRIVACY.md` and the declarations below true to what the app does. A new permission, network request, analytics or ads means updating all of them.

## Google Play declarations

| Declaration | Answer |
| --- | --- |
| Privacy policy | https://github.com/lucien-loua/treso/blob/main/PRIVACY.md (so the repository stays public) |
| App access | All functionality is available without special access |
| Ads | No ads |
| Content rating | Not a game; "No" to every content question. Expected rating: Everyone, PEGI 3 |
| Target audience | 18 and over only; the app doesn't appeal to children |
| Data safety | No user data collected or shared |
| Financial features | My app doesn't provide any financial features: it records the user's own entries, with no payments, transfers, loans, investments or bank connection |
| News, government, health | No |
| Advertising ID | No |

**Data safety.** Google counts data as collected when it leaves the device. Treso stores everything on the phone and has no account, server, analytics, crash reporting or ads. Its only network request downloads public exchange rates and sends no user data. Backups and CSV exports leave the phone only when the user shares them, and Google doesn't count a transfer the user starts as sharing.

## First Google Play release

Personal developer accounts created after November 13, 2023 need a closed test before production: at least 12 testers, opted in for 14 days in a row. Internal testing doesn't count.

1. Build with the `production` profile, then upload with `bunx eas-cli submit -p android --latest`. The build lands in internal testing as a draft: roll it out to yourself to check it.
2. Create a closed test, add at least 12 testers (an email list or a Google Group) and promote the release to it.
3. After 14 days, select **Apply for production** on the Dashboard. The review usually takes 7 days or less.

## Credentials

- EAS keeps the signing keys (Play App Signing for Android): `bunx eas-cli credentials`. Never commit a keystore.
- EAS Submit needs a Google Cloud service account with access to the app in Play Console (**Users and permissions**). Save its JSON key as `./google-service-account.json`. Git ignores it.

## References

- Data safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Financial features declaration: https://support.google.com/googleplay/android-developer/answer/13849271
- Testing requirements for new personal accounts: https://support.google.com/googleplay/android-developer/answer/14151465
- EAS Submit for Android: https://docs.expo.dev/submit/android/
