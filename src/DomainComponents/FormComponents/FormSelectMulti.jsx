import { Label } from "@/components/ui/label";
import Select from "react-select";
import { Controller, useWatch } from "react-hook-form";
import { useMemo } from "react";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

export default function FormSelectMulti({
  label,
  name,
  control,
  error,
  options = [],
  placeholder = "Select",
  isClearable = true,
  isMulti = true,
  rules,
  disabled,
}) {
  const fieldValue = useWatch({ control, name });

  // Map field value to Select-compatible format
  const selectedValue = useMemo(() => {
    if (!fieldValue) return isMulti ? [] : null;

    if (isMulti) {
      return options.filter((opt) =>
        fieldValue.some((v) =>
          typeof v === "object" ? v?.value === opt.value : v === opt.value
        )
      );
    }

    return (
      options.find((opt) =>
        typeof fieldValue === "object"
          ? opt.value === fieldValue.value
          : opt.value === fieldValue
      ) || null
    );
  }, [fieldValue, isMulti, options]);

  return (
    <div className="flex flex-col gap-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <div>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <Select
              {...field}
              inputId={name}
              options={options}
              value={selectedValue}
              placeholder={placeholder}
              onChange={(val) => {
                // Save only values (not full option objects) in form state
                if (isMulti) {
                  const selected = val?.map((v) => v.value) || [];
                  field.onChange(selected);
                } else {
                  field.onChange(val?.value || null);
                }
              }}
              isDisabled={disabled}
              isClearable={isClearable}
              isSearchable
              isMulti={isMulti}
              closeMenuOnSelect={!isMulti}
              components={animatedComponents}
              classNamePrefix="react-select"
            />
          )}
        />
        {error && <span className="text-xs text-red-500">{error.message}</span>}
      </div>
    </div>
  );
}
