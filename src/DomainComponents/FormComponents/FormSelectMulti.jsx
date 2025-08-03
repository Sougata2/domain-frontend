import { Label } from "@/components/ui/label";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";

export default function FormSelectMulti({
  label,
  name,
  control,
  error,
  options,
  placeholder = "Select",
  isClearable = true,
  isMulti = true,
  rules,
}) {
  const [selectedValue, setSelectedValue] = useState(null);

  const updateSelected = useCallback(
    (value) => {
      if (isMulti) {
        const mapped = options.filter((opt) =>
          value?.some((v) => v === opt.value || v.value === opt.value)
        );
        setSelectedValue(mapped);
      } else {
        const found = options.find(
          (opt) => opt.value === value?.value || opt.value === value
        );
        setSelectedValue(found || null);
      }
    },
    [isMulti, options]
  );

  useEffect(() => {
    control._formValues && updateSelected(control._formValues[name]);
  }, [control, name, options, updateSelected]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <div>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <Select
              {...field}
              isSearchable
              inputId={name}
              options={options}
              closeMenuOnSelect={false}
              placeholder={placeholder}
              isClearable={isClearable}
              isMulti={isMulti}
              value={selectedValue}
              onChange={(val) => {
                setSelectedValue(val);
                field.onChange(val);
              }}
              classNamePrefix="react-select"
            />
          )}
        />
        {error && <span className="text-xs text-red-500">{error.message}</span>}
      </div>
    </div>
  );
}
