import { Label } from "@/components/ui/label";

export default function FormTextarea({
  label,
  name,
  register,
  error,
  validation,
  ...props
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <div>
        <textarea
          id={name}
          {...props}
          {...register(name, { ...validation })}
          className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-3 focus:ring-purple-400 focus:border-transparent"
        />
        {error && <span className="text-xs text-red-500">{error.message}</span>}
      </div>
    </div>
  );
}
