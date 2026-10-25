import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * Material 3 button (BRIDGEGOOD's M3Button): fully rounded, 40px visible height with a 48px touch target.
 * Variants keep the shadcn names the app already uses: default = filled, secondary = tonal,
 * outline = outlined, ghost = text.
 */
const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,box-shadow,color] duration-200 ease-standard select-none after:absolute after:inset-x-0 after:-inset-y-1 after:content-[''] disabled:pointer-events-none disabled:opacity-40 aria-invalid:outline-destructive [&_.material-symbols-rounded]:text-[1.125rem]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:shadow-sm hover:bg-[color-mix(in_srgb,var(--primary),var(--primary-foreground)_8%)]",
        secondary:
          "bg-secondary-container text-on-secondary-container hover:shadow-sm hover:bg-[color-mix(in_srgb,var(--secondary-container),var(--on-secondary-container)_8%)]",
        outline:
          "border border-outline bg-transparent text-primary hover:bg-[color-mix(in_srgb,transparent,var(--primary)_8%)] aria-expanded:bg-[color-mix(in_srgb,transparent,var(--primary)_12%)]",
        ghost: "bg-transparent text-primary hover:bg-[color-mix(in_srgb,transparent,var(--primary)_8%)]",
        destructive: "bg-destructive text-[var(--surface)] hover:shadow-sm",
        link: "rounded-sm text-primary underline underline-offset-4 hover:decoration-2",
      },
      size: {
        default: "min-h-10 px-6 label-large",
        sm: "min-h-9 px-4 text-sm",
        lg: "min-h-12 px-8 label-large",
        icon: "size-12",
        "icon-sm": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
