import { NativeTabs } from "expo-router/native-tabs";

import { colors } from "@/theme";

const TabsLayout = () => (
  <NativeTabs tintColor={colors.tint} minimizeBehavior="onScrollDown">
    <NativeTabs.Trigger name="(home)">
      <NativeTabs.Trigger.Icon
        sf={{ default: "chart.pie", selected: "chart.pie.fill" }}
        md="pie_chart"
      />
      <NativeTabs.Trigger.Label>Aperçu</NativeTabs.Trigger.Label>
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="transactions">
      <NativeTabs.Trigger.Icon
        sf={{
          default: "list.bullet.rectangle",
          selected: "list.bullet.rectangle.fill",
        }}
        md="receipt_long"
      />
      <NativeTabs.Trigger.Label>Opérations</NativeTabs.Trigger.Label>
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="settings">
      <NativeTabs.Trigger.Icon
        sf={{ default: "gearshape", selected: "gearshape.fill" }}
        md="settings"
      />
      <NativeTabs.Trigger.Label>Réglages</NativeTabs.Trigger.Label>
    </NativeTabs.Trigger>
  </NativeTabs>
);

export default TabsLayout;
