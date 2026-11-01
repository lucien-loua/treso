import { readProfile } from "./profile";
import type { Profile } from "./profile";
import { readStored, useStored, writeStored } from "./storage";

const PROFILE_KEY = "treso.profile";

const parse = (raw: string | null) => {
  if (raw === null) {
    return null;
  }
  try {
    return readProfile(JSON.parse(raw));
  } catch {
    return null;
  }
};

const writeProfile = (profile: Profile | null) =>
  writeStored(PROFILE_KEY, profile ? JSON.stringify(profile) : null);

/** The profile, `null` until the first-run questions are answered (or skipped). */
export const useProfile = (): [Profile | null, (profile: Profile) => void] => [
  parse(useStored(PROFILE_KEY)),
  writeProfile,
];

/** For a backup. */
export const profileBackup = () => parse(readStored(PROFILE_KEY));

export const restoreProfile = (profile: Profile | null) => {
  if (profile) {
    writeProfile(profile);
  }
};
