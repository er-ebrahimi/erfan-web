import {
  Camera,
  ClipboardList,
  Eye,
  HelpCircle,
  Home,
  Image as ImageIcon,
  Languages,
  type LucideIcon,
  MessageCircle,
  Palette,
  Ruler,
  Sliders,
  Sparkles,
  Upload,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  camera: Camera,
  clipboard: ClipboardList,
  eye: Eye,
  help: HelpCircle,
  home: Home,
  image: ImageIcon,
  languages: Languages,
  chat: MessageCircle,
  palette: Palette,
  ruler: Ruler,
  sliders: Sliders,
  sparkles: Sparkles,
  upload: Upload,
};

export function iconFor(
  name?: string | null,
  fallback: LucideIcon = Sparkles
): LucideIcon {
  if (!name) return fallback;
  return ICONS[name] ?? fallback;
}
