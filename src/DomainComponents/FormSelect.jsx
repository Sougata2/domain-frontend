import { Label } from "@/components/ui/label";
import Select from "react-select";

export default function FormSelect({
  label,
  name,
  register,
  error,
  validation,
  options,
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Select
        {...register(name, { ...validation })}
        placeholder={`Select ${label}`}
        options={options}
        isSearchable
        isClearable
      />
      <div>
        {error && (
          <span className={"text-xs text-red-500"}>{error.message}</span>
        )}
      </div>
    </div>
  );
}
