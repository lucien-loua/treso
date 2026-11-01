import { Text } from "react-native";
import type { TextProps } from "react-native";

import { type } from "@/theme";
import type { TypeVariant } from "@/theme";

export const ThemedText = ({
  variant = "body",
  style,
  ...props
}: TextProps & { variant?: TypeVariant }) => (
  <Text style={[type[variant], style]} {...props} />
);
