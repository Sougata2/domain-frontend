import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function FormFileInput({ label, name, register, error, validation, ...props }) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="upload-file">{label}</Label>
      <Input
        id="upload-file"
        type="file"
        {...props}
        {...register(name, { ...validation })}
      />
      <div>
        {error && (
          <span className={"text-xs text-red-500"}>{error.message}</span>
        )}
      </div>
    </div>
  );
}

export default FormFileInput;
