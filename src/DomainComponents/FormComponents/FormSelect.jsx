import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import Select from "react-select";

export default function FormSelect({
  label,
  name,
  control,
  error,
  options,
  validations,
  placeholder = "Select",
  ...props
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <div>
        <Controller
          name={name}
          control={control}
          rules={validations}
          render={({ field }) => (
            <Select
              {...field}
              {...props}
              inputId={name}
              options={options}
              placeholder={placeholder}
              isClearable
              isSearchable
              onChange={(val) => field.onChange(val)}
              value={field.value}
              classNamePrefix="react-select"
            />
          )}
        />
        {error && <span className="text-xs text-red-500">{error.message}</span>}
      </div>
    </div>
  );
}
