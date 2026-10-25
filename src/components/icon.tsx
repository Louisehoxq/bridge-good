import type { LucideIcon, LucideProps } from "lucide-react"
import {
  Accessibility,
  ArrowRight,
  Bot,
  Building2,
  Calendar,
  CalendarClock,
  Check,
  CircleAlert,
  CircleCheck,
  CirclePlay,
  Clock,
  ExternalLink,
  FileText,
  HeartHandshake,
  ImagePlus,
  Info,
  LogIn,
  Mail,
  MapPin,
  Menu,
  MessageCircleHeart,
  Pencil,
  Route,
  ScrollText,
  Send,
  Sparkles,
  Sprout,
  StickyNote,
  TriangleAlert,
  Users,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Lucide outline icons (DESIGN.md section 5). The snake_case names are the Material Symbols names the app
 * used before Bridge Studio, kept so call sites don't change. The same icon always means the same thing.
 */
const ICONS = {
  accessibility_new: Accessibility,
  add_photo_alternate: ImagePlus,
  arrow_forward: ArrowRight,
  auto_awesome: Sparkles,
  calendar_clock: CalendarClock,
  calendar_today: Calendar,
  check: Check,
  close: X,
  description: FileText,
  group: Users,
  location_on: MapPin,
  login: LogIn,
  mail: Mail,
  menu: Menu,
  open_in_new: ExternalLink,
  play_circle: CirclePlay,
  schedule: Clock,
  send: Send,
  smart_toy: Bot,

  // Bridge Studio meanings: roles, status, AI drafts and studio marks.
  sprout: Sprout,
  "message-circle-heart": MessageCircleHeart,
  "map-pin": MapPin,
  "building-2": Building2,
  "heart-handshake": HeartHandshake,
  "scroll-text": ScrollText,
  "circle-check": CircleCheck,
  "circle-alert": CircleAlert,
  "triangle-alert": TriangleAlert,
  info: Info,
  sparkles: Sparkles,
  pencil: Pencil,
  "sticky-note": StickyNote,
  route: Route,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICONS

export const ICON_NAMES = Object.keys(ICONS) as IconName[]

/**
 * Decorative icon. Always pair it with visible text or an aria-label on the control.
 * It is 1.25em of the surrounding text (20px beside body text); a text-size class on it sets the size.
 */
export function Icon({ name, className, ...props }: { name: IconName } & Omit<LucideProps, "ref">) {
  const Glyph = ICONS[name]
  return (
    <Glyph
      aria-hidden="true"
      focusable="false"
      size="1em"
      strokeWidth={1.75}
      className={cn("bgx-icon inline-block shrink-0 select-none", className)}
      {...props}
    />
  )
}
