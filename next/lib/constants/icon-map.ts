import {
  IconBolt,
  IconBrain,
  IconBriefcase,
  IconChartBar,
  IconChartHistogram,
  IconCode,
  IconDatabaseSearch,
  IconEye,
  IconMessageChatbot,
  IconPencil,
  IconPencilBolt,
  IconPlug,
  IconPlugConnected,
  IconRobot,
  IconRocket,
  IconSearch,
  IconSparkles,
} from '@tabler/icons-react';
import { Icon } from '@tabler/icons-react';

const iconMap: Record<string, Icon> = {
  IconMessageChatbot,
  IconRobot,
  IconEye,
  IconChartHistogram,
  IconDatabaseSearch,
  IconPlugConnected,
  IconSearch,
  IconPencil,
  IconPencilBolt,
  IconCode,
  IconRocket,
  IconSparkles,
  IconPlug,
  IconBriefcase,
  IconChartBar,
  IconBolt,
  IconBrain,
};

export function getTablerIcon(name?: string): Icon {
  if (!name) return IconSparkles;
  return iconMap[name] ?? IconSparkles;
}
