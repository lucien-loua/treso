import { router, Stack } from "expo-router";

import { useI18n } from "@/i18n/context";

export interface FormHeaderProps {
  title: string;
  submitLabel: string;
  canSave: boolean;
  onSave: () => void;
}

/** iOS sheet header: "Cancel" on the left, the save action on the right (Android: see `.android.tsx`). */
export const FormHeader = ({
  title,
  submitLabel,
  canSave,
  onSave,
}: FormHeaderProps) => {
  const { t } = useI18n();
  return (
    <>
      <Stack.Screen.Title>{title}</Stack.Screen.Title>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button onPress={() => router.back()}>
          {t.actions.cancel}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          variant="done"
          disabled={!canSave}
          onPress={onSave}
        >
          {submitLabel}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
    </>
  );
};
