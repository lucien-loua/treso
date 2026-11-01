import type { TextInputRef } from "@expo/ui";
import { Button, Row, Spacer, Text, TextInput } from "@expo/ui";
import { useRef, useState } from "react";

import { useInk } from "@/hooks/use-ink";
import { useI18n } from "@/i18n/context";
import { spacing } from "@/theme";

/** Room for a figure such as « 1 500 000 »: without it, Compose shrinks the field to nothing. */
const FIELD_WIDTH = 140;
const MAX_LENGTH = 14;

/**
 * A setting typed as a number: label, field, unit. Saves when the field loses focus, and only
 * if something was typed, so a value shown converted or rounded is never written back. The
 * iOS number pad has no return key, so an "OK" button shows while typing.
 */
export const NumberRow = ({
  label,
  value,
  unit,
  placeholder,
  accessibilityLabel,
  decimals,
  onSave,
}: {
  label: string;
  /** The figure shown, as `toInput` writes it ("" when there is none) */
  value: string;
  unit: string;
  placeholder?: string;
  accessibilityLabel: string;
  /** Whether a decimal separator can be typed */
  decimals: boolean;
  /** Receives the text typed; nothing is saved while the field only shows `value`. */
  onSave: (text: string) => void;
}) => {
  const ink = useInk();
  const { t } = useI18n();
  const input = useRef<TextInputRef>(null);
  const typed = useRef<string | null>(null);
  const [editing, setEditing] = useState(false);

  return (
    <Row alignment="center" spacing={spacing.smd}>
      <Text textStyle={{ color: ink.label }}>{label}</Text>
      <Spacer flexible />
      <TextInput
        // A new value from elsewhere (currency, rates) replaces the field's text
        key={value}
        ref={input}
        defaultValue={value}
        placeholder={placeholder}
        accessibilityLabel={accessibilityLabel}
        keyboardType={decimals ? "decimal-pad" : "number-pad"}
        returnKeyType="done"
        textAlign="right"
        style={{ width: FIELD_WIDTH }}
        maxLength={MAX_LENGTH}
        onChangeText={(text) => {
          typed.current = text;
        }}
        onFocus={() => setEditing(true)}
        onSubmitEditing={() => input.current?.blur()}
        onBlur={() => {
          setEditing(false);
          if (typed.current !== null && typed.current !== value) {
            onSave(typed.current.trim());
          }
          typed.current = null;
        }}
      />
      <Text textStyle={{ color: ink.secondaryLabel }}>{unit}</Text>
      {editing ? (
        <Button
          variant="text"
          label={t.actions.ok}
          onPress={() => input.current?.blur()}
        />
      ) : null}
    </Row>
  );
};
