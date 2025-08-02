import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";

export default function FormSelect({
  label,
  name,
  control,
  error,
  validation,
  options,
  className = "w-full",
  ...props
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        rules={validation}
        render={({ field }) => {
          const selectedOption = options?.find(
            (o) => o.id === Number(field.value)
          );

          return (
            <Select
              {...props}
              onValueChange={(val) => field.onChange(Number(val))}
              value={field.value?.toString() ?? ""}
            >
              <SelectTrigger className={className}>
                <SelectValue placeholder={`Select ${label}`}>
                  {selectedOption?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.id} value={option.id.toString()}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      />
      {error && <div className={"text-red-400 text-sm"}>{error.message}</div>}
    </div>
  );
}
