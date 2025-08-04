import { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const FormSelectMulti = forwardRef(function FormSelectMulti(
  { name, label, error, options, disabled, defaultValue, handleOnChange },
  ref
) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Select
        isMulti
        id={name}
        ref={ref}
        options={options}
        isDisabled={disabled}
        onChange={handleOnChange}
        closeMenuOnSelect={false}
        defaultValue={defaultValue}
        components={animatedComponents}
      />
      {error && <div className={"text-red-400 text-sm"}>{error.message}</div>}
    </div>
  );
});

export default FormSelectMulti;
