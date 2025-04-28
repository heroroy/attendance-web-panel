import { ButtonVariant } from "../Util/ButtonTypes";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
}

const primaryButtonClass = "bg-[#0066F9] text-white hover:bg-blue-700";

const variantClasses: Record<ButtonVariant, string> = {
  [ButtonVariant.Danger]: "bg-red-600 text-white hover:bg-red-700",
  [ButtonVariant.Success]: "bg-green-600 text-white hover:bg-green-700",
  [ButtonVariant.Active]: primaryButtonClass,
  [ButtonVariant.NonActive]: "bg-transparent text-gray-700 hover:bg-gray-100",
  [ButtonVariant.Default]: primaryButtonClass,
};

export function Button({
  children,
  variant = ButtonVariant.Default,
  fullWidth = false,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`py-4 px-8 rounded font-bold mt-2 transition duration-200 ${
        variantClasses[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
