import { Host, Picker } from "@expo/ui";

import { useI18n } from "@/i18n/context";

const days = Array.from({ length: 31 }, (_, index) => index + 1);

/** Native menu picker for a day of the month (1–31). */
export const DayField = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (day: number) => void;
}) => {
  const { t } = useI18n();
  return (
    <Host matchContents>
      <Picker selectedValue={value} onValueChange={onChange}>
        {days.map((day) => (
          <Picker.Item key={day} label={t.dayOfMonth(day)} value={day} />
        ))}
      </Picker>
    </Host>
  );
};
