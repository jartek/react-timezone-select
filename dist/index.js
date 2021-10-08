import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import Select from "react-select";
import spacetime from "spacetime";
import soft from "timezone-soft";
import allTimezones from './timezone-list';
export var LabelType;
(function (LabelType) {
    LabelType["ORIGINAL"] = "original";
    LabelType["ALTNAME"] = "altName";
    LabelType["ABBREV"] = "abbrev";
})(LabelType || (LabelType = {}));
const TimezoneSelect = ({ value, onBlur, onChange, labelStyle = "original", timezones = allTimezones, ...props }) => {
    const getOptions = React.useMemo(() => {
        return Object.entries(timezones)
            .reduce((selectOptions, zone) => {
            const now = spacetime.now(zone[0]);
            const tz = now.timezone();
            const tzStrings = soft(zone[0]);
            let label = "";
            // @ts-expect-error
            let abbr = now.isDST() ? tzStrings[0].daylight?.abbr : tzStrings[0].standard?.abbr;
            let altName = now.isDST() ? tzStrings[0].daylight?.name : tzStrings[0].standard?.name;
            const min = tz.current.offset * 60;
            const hr = `${(min / 60) ^ 0}:` + (min % 60 === 0 ? "00" : Math.abs(min % 60));
            const prefix = `(GMT${hr.includes("-") ? hr : `+${hr}`}) ${zone[1]}`;
            switch (labelStyle) {
                case "original":
                    label = prefix;
                    break;
                case "altName":
                    label = `${prefix} ${altName?.length ? `(${altName})` : ""}`;
                    break;
                case "abbrev":
                    label = `${prefix} ${abbr?.length < 5 ? `(${abbr})` : ""}`;
                    break;
                default:
                    label = `${prefix}`;
            }
            selectOptions.push({
                value: tz.name,
                label: label,
                offset: tz.current.offset,
                abbrev: abbr,
                altName: altName,
            });
            return selectOptions;
        }, [])
            .sort((a, b) => a.offset - b.offset);
    }, [labelStyle, timezones]);
    const handleChange = (tz) => {
        onChange && onChange(tz);
    };
    const findFuzzyTz = (zone) => {
        let currentTime = spacetime.now('GMT');
        try {
            currentTime = spacetime.now(zone);
        }
        catch (err) {
            return;
        }
        return getOptions
            .filter((tz) => tz.offset === currentTime.timezone().current.offset)
            .map((tz) => {
            let score = 0;
            if (currentTime.timezones[tz.value.toLowerCase()] &&
                !!currentTime.timezones[tz.value.toLowerCase()].dst ===
                    currentTime.timezone().hasDst) {
                if (tz.value
                    .toLowerCase()
                    .indexOf(currentTime.tz.substr(currentTime.tz.indexOf("/") + 1)) !== -1) {
                    score += 8;
                }
                if (tz.label
                    .toLowerCase()
                    .indexOf(currentTime.tz.substr(currentTime.tz.indexOf("/") + 1)) !== -1) {
                    score += 4;
                }
                if (tz.value
                    .toLowerCase()
                    .indexOf(currentTime.tz.substr(0, currentTime.tz.indexOf("/")))) {
                    score += 2;
                }
                score += 1;
            }
            else if (tz.value === "GMT") {
                score += 1;
            }
            return { tz, score };
        })
            .sort((a, b) => b.score - a.score)
            .map(({ tz }) => tz)[0];
    };
    const parseTimezone = (zone) => {
        if (typeof zone === "object" && zone.value && zone.label)
            return zone;
        if (typeof zone === "string") {
            return (getOptions.find(tz => tz.value === zone) ||
                (zone.indexOf("/") !== -1 && findFuzzyTz(zone)));
        }
        else if (zone.value && !zone.label) {
            return getOptions.find(tz => tz.value === zone.value);
        }
    };
    return (_jsx(Select, Object.assign({ value: parseTimezone(value), onChange: handleChange, options: getOptions, onBlur: onBlur }, props), void 0));
};
export default TimezoneSelect;
export { allTimezones };
//# sourceMappingURL=index.js.map