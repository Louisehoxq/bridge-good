import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * Bridge Studio button (DESIGN.md section 7): 48px tall, 10px radius, label type. No pills.
 * Variants keep the shadcn names the app already uses:
 * - default: primary, action fill (one per view)
 * - secondary / outline: surface fill, 1.5px line-strong border, action text
 * - ghost: quiet, text only, underlined on hover
 * - destructive: secondary with error text. Pair it with an icon and a confirmation step.
 * - link: an inline text link
 * Focus uses the global 3px outline from app.css; never remove it.
 */
const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border-[1.5px] border-transparent type-label whitespace-nowrap transition-colors duration-150 ease-standard select-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_.bgx-icon]:text-[1.25rem]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[color-mix(in_srgb,var(--action),var(--ink)_20%)]",
        secondary: "border-input bg-card text-primary hover:bg-muted aria-expanded:bg-muted",
        outline: "border-input bg-card text-primary hover:bg-muted aria-expanded:bg-muted",
        ghost: "bg-transparent text-primary underline-offset-4 hover:underline aria-expanded:bg-muted",
        destructive: "border-input bg-card text-destructive hover:bg-error-soft",
        link: "rounded-xs border-0 text-primary underline underline-offset-4 hover:decoration-2",
      },
      size: {
        default: "min-h-12 px-5",
        // 40px visible, with the hit area padded to 48px.
        sm: "min-h-10 px-4 after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']",
        lg: "min-h-14 px-6",
        icon: "size-12",
        "icon-sm": "size-10 after:absolute after:-inset-1 after:content-['']",
      },
    },
    compoundVariants: [
      { variant: "ghost", size: ["default", "sm", "lg"], className: "px-3" },
      { variant: "link", size: ["default", "sm", "lg"], className: "min-h-0 px-0" },
    ],
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
