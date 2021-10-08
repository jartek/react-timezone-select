/// <reference types="react" />
import allTimezones from './timezone-list';
import type { Props, ITimezone, ITimezoneOption, ILabelStyle } from './types/timezone';
export declare enum LabelType {
    ORIGINAL = "original",
    ALTNAME = "altName",
    ABBREV = "abbrev"
}
declare const TimezoneSelect: ({ value, onBlur, onChange, labelStyle, timezones, ...props }: Props) => JSX.Element;
export default TimezoneSelect;
export { allTimezones };
export type { ITimezone, ITimezoneOption, Props, ILabelStyle };
