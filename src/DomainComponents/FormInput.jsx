import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FormInput({
  label,
  name,
  register,
  error,
  validation,
  ...props
}) {
  return (
    <div className={"flex flex-col gap-2"}>
      <Label htmlFor={name}>{label}</Label>
      <div>
        <Input {...props} {...register(name, { ...validation })} />
        <div>
          {error && (
            <span className={"text-xs text-red-500"}>{error.message}</span>
          )}
        </div>
      </div>
    </div>
  );
}
