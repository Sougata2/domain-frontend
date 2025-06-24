import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import Select from "react-select";

export default function FormSelect({
  label,
  name,
  error,
  validation,
  options,
  control,
  defaultValue,
}) {
  console.log(defaultValue);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        rules={validation}
        render={({ field }) => {
          return (
            <Select
              {...field}
              onChange={(e) => field.onChange(e)}
              placeholder={`Select ${label}`}
              options={options}
              defaultValue={
                defaultValue && defaultValue.value ? defaultValue : null
              }
              isSearchable
              isClearable
            />
          );
        }}
      />
      <div>
        {error && (
          <span className={"text-xs text-red-500"}>{error.message}</span>
        )}
      </div>
    </div>
  );
}
