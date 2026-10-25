import type { LucideIcon, LucideProps } from "lucide-react"
import {
  Accessibility,
  ArrowRight,
  BookOpen,
  Bot,
  Building2,
  Calendar,
  CalendarClock,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  CirclePlay,
  ClipboardList,
  Clock,
  ExternalLink,
  FilePlus,
  FileText,
  Flag,
  FolderOpen,
  HeartHandshake,
  Hourglass,
  House,
  ImagePlus,
  Info,
  LayoutGrid,
  LogIn,
  Mail,
  MapPin,
  Menu,
  MessageCircleHeart,
  MessagesSquare,
  Pencil,
  PencilRuler,
  Plus,
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
 * Lucide outline icons (DESIGN.md section 5), named by their kebab-case Lucide names. The same icon always
 * means the same thing.
 */
const ICONS = {
  accessibility: Accessibility,
  "arrow-right": ArrowRight,
  bot: Bot,
  calendar: Calendar,
  "calendar-clock": CalendarClock,
  check: Check,
  clock: Clock,
  "circle-play": CirclePlay,
  "external-link": ExternalLink,
  "file-text": FileText,
  "image-plus": ImagePlus,
  "log-in": LogIn,
  mail: Mail,
  menu: Menu,
  send: Send,
  users: Users,
  x: X,

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

  // Sidebar and page meanings.
  house: House,
  "book-open": BookOpen,
  "messages-square": MessagesSquare,
  "pencil-ruler": PencilRuler,
  "clipboard-list": ClipboardList,
  "folder-open": FolderOpen,
  "file-plus": FilePlus,
  "layout-grid": LayoutGrid,
  flag: Flag,
  hourglass: Hourglass,
  plus: Plus,
  "chevron-down": ChevronDown,
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
