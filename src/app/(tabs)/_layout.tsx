import { Redirect } from "expo-router";
import { NativeTabs } from "expo-router/native-tabs";

import { useProfile } from "@/data/profile-store";
import { useI18n } from "@/i18n/context";
import { colors } from "@/theme";

const TabsLayout = () => {
  const { t } = useI18n();
  const [profile] = useProfile();
  // First launch: the app opens on the questions about the user's life
  if (profile === null) {
    return <Redirect href="/onboarding" />;
  }
  return (
    <NativeTabs tintColor={colors.tint} minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Icon
          sf={{ default: "chart.pie", selected: "chart.pie.fill" }}
          md="pie_chart"
        />
        <NativeTabs.Trigger.Label>{t.tabs.overview}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="transactions">
        <NativeTabs.Trigger.Icon
          sf={{
            default: "list.bullet.rectangle",
            selected: "list.bullet.rectangle.fill",
          }}
          md="receipt_long"
        />
        <NativeTabs.Trigger.Label>
          {t.tabs.transactions}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          md="settings"
        />
        <NativeTabs.Trigger.Label>{t.tabs.settings}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabsLayout;
