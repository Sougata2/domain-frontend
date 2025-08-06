import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

function FormMultiSelect({
  control,
  name,
  label,
  options,
  error,
  validations,
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        rules={validations}
        render={({ field }) => {
          const selectedOptionIds = field.value.map((f) => f.value.id);
          return (
            <Select
              inputId={name}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={options}
              onChange={(e) => field.onChange(e)}
              value={options.filter((option) =>
                selectedOptionIds.includes(option.value.id)
              )}
            />
          );
        }}
      />
      {error && <div className={"text-red-400 text-sm"}>{error.message}</div>}
    </div>
  );
}

export default FormMultiSelect;
