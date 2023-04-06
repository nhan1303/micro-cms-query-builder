import { isEmpty, isUndefined } from "./lodash";

export function getValue<T, TDefaultValue = T>(
  value: T,
  defaultValue: TDefaultValue,
  strictMode: boolean = false
) {
  if (strictMode) {
    if (!isUndefined(value) && !isEmpty(value)) return value;
    return defaultValue;
  }
  return value ?? defaultValue;
}
