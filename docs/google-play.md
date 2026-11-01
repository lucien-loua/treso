# Google Play

What the Play Console asks for, and the answers that are true for Treso today. When the app's data use changes (a new permission, a new network request, analytics, ads…), update this file, [`PRIVACY.md`](../PRIVACY.md) and the store listing together.

## Store listing

Default language: French (France), `fr-FR`. Add English (United States), `en-US`, as a translation, with its own graphics.

| Play Console field | File in `fastlane/metadata/android/<locale>/` |
| --- | --- |
| App name (30 characters) | `title.txt` |
| Short description (80) | `short_description.txt` |
| Full description (4,000) | `full_description.txt` |
| App icon (512 × 512, 32-bit PNG) | `images/icon.png` |
| Feature graphic (1024 × 500, no transparency) | `images/featureGraphic.png` |
| Phone screenshots (1080 × 1920, 9:16) | `images/phoneScreenshots/1.png` … `6.png` |
| Release notes | `changelogs/1.txt` |

Store settings:

- **App or game:** app. **Category:** Finance. **Tags:** up to five, about budgeting and expense tracking.
- **Contact details:** a public email address (required). Website: https://github.com/lucien-loua/treso.
- **Price:** free. A free app can't be made paid later.
- **Countries:** all. Nothing in the app depends on the region.

## App content

| Declaration | Answer | Why |
| --- | --- | --- |
| Privacy policy | https://github.com/lucien-loua/treso/blob/main/PRIVACY.md | Must stay public, so the repository must stay public. |
| App access | All functionality is available without special access | No account, no login. |
| Ads | No, the app doesn't contain ads |  |
| Content rating | Not a game; "No" to every content question (see below) | Expected rating: Everyone, PEGI 3. |
| Target audience | 18 and over only; the app doesn't appeal to children | Keeps the app outside the Families policy. |
| News app | No |  |
| Data safety | No user data collected or shared (see below) |  |
| Government app | No |  |
| Financial features | My app doesn't provide any financial features | Treso records the user's own entries. No payments, transfers, loans, investments or bank connection. |
| Health | No health features |  |
| Advertising ID | No | No ads or analytics SDK. |

**Content rating questionnaire.** Treso has no violence, sexual content, profanity, drugs or gambling. Users can't talk to each other or share content with other users inside the app. The app doesn't share location, doesn't sell digital goods and has no web browser.

**Data safety.** Google counts data as collected when it leaves the device. In Treso:

- Everything is stored on the phone (SQLite and local key-value storage). There is no account, server, analytics, crash reporting or ads.
- The only network request downloads public exchange rates (jsDelivr, with Cloudflare Pages as fallback). It sends no user data.
- Backups and CSV exports leave the phone only when the user shares them through the system share sheet. Google doesn't count a transfer the user starts as sharing.

So answer "No" to "Does your app collect or share any of the required user data types?". The listing then shows "No data collected" and "No data shared with third parties".

## First release

Personal developer accounts created after November 13, 2023 can't publish to production straight away. They first need a closed test with at least 12 testers, opted in for 14 days in a row. Internal testing doesn't count.

1. Build: `bunx eas-cli build -p android --profile production`.
2. Upload: `bunx eas-cli submit -p android --latest`. The build goes to internal testing as a draft (see `eas.json`). Roll it out to yourself to check it.
3. Create a closed test, add at least 12 testers (an email list or a Google Group) and promote the release to it. Keep the testers opted in for 14 days.
4. On the Dashboard, select **Apply for production**. The review usually takes 7 days or less.

Setup for step 2:

- **Signing:** Play App Signing (the default). EAS keeps the upload key: `bunx eas-cli credentials`.
- **Service account:** EAS Submit needs a Google Cloud service account that has access to the app in Play Console (**Users and permissions**). Save its JSON key as `google-service-account.json` at the repository root. Git ignores it.

## References

- Preview assets (icon, feature graphic, screenshots): https://support.google.com/googleplay/android-developer/answer/9866151
- Data safety section: https://support.google.com/googleplay/android-developer/answer/10787469
- Financial features declaration: https://support.google.com/googleplay/android-developer/answer/13849271
- Testing requirements for new personal accounts: https://support.google.com/googleplay/android-developer/answer/14151465
- EAS Submit for Android: https://docs.expo.dev/submit/android/
