import { Stack } from "expo-router";

export interface StepHeaderProps {
  /** Leaves without saving (opened from Settings). Android uses the system back instead. */
  cancelLabel?: string;
  onCancel?: () => void;
  /** Ends the questions now (first launch). */
  skipLabel?: string;
  onSkip?: () => void;
}

/** iOS header: « Annuler » on the left, « Passer » on the right (Android: see `.android.tsx`). */
export const StepHeader = ({
  cancelLabel,
  onCancel,
  skipLabel,
  onSkip,
}: StepHeaderProps) => (
  <>
    {cancelLabel && onCancel ? (
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button onPress={onCancel}>
          {cancelLabel}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
    ) : null}
    {skipLabel && onSkip ? (
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button onPress={onSkip}>
          {skipLabel}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
    ) : null}
  </>
);
