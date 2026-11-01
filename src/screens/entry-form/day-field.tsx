import { Host, Picker } from "@expo/ui";

const days = Array.from({ length: 31 }, (_, index) => index + 1);

/** Native menu picker for a day of the month (1–31). */
export function DayField({ value, onChange }: { value: number; onChange: (day: number) => void }) {
	return (
		<Host matchContents>
			<Picker selectedValue={value} onValueChange={onChange}>
				{days.map((day) => (
					<Picker.Item key={day} label={day === 1 ? "1er" : String(day)} value={day} />
				))}
			</Picker>
		</Host>
	);
}
