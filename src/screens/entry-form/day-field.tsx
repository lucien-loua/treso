import { Host, Picker } from "@expo/ui";

import { formatDayOfMonth } from "@/utils/dates";

const days = Array.from({ length: 31 }, (_, index) => index + 1);

/** Native menu picker for a day of the month (1–31). */
export const DayField = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (day: number) => void;
}) => (
  <Host matchContents>
    <Picker selectedValue={value} onValueChange={onChange}>
      {days.map((day) => (
        <Picker.Item key={day} label={formatDayOfMonth(day)} value={day} />
      ))}
    </Picker>
  </Host>
);
