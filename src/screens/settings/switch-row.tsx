import { Row, Spacer, Switch, Text } from "@expo/ui";

import { useInk } from "@/hooks/use-ink";

/**
 * A labeled switch. iOS: SwiftUI's own labeled toggle. Android: label and switch side by side,
 * because a labeled `Switch` there only toggles from its label, not from the switch itself.
 */
export const SwitchRow = ({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) => {
  const ink = useInk();
  if (process.env.EXPO_OS === "ios") {
    return <Switch label={label} value={value} onValueChange={onValueChange} />;
  }
  return (
    <Row alignment="center">
      <Text textStyle={{ color: ink.label }}>{label}</Text>
      <Spacer flexible />
      <Switch value={value} onValueChange={onValueChange} />
    </Row>
  );
};
