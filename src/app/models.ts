export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

export interface NavGroup {
  heading: string;
  items: NavItem[];
}

export interface StatCard {
  label: string;
  value: string;
  sub: string;
  icon: string;
  /** 0–100 fill percentage for the progress bar, omit to hide */
  fill?: number;
  /** optional accent colour class for icon tint */
  accent?: string;
}

export interface SparkPoint {
  x: number;
  y: number;
}

export interface ChartSeries {
  title: string;
  subtitle: string;
  points: SparkPoint[];
  labels: string[];
  color: string;
}

export interface DonutSlice {
  label: string;
  players: number;
  color: string;
  offset: number;
}

export type GroupServiceType = 'PROXY' | 'LOBBY' | 'SERVER';
export type RuntimeServiceStatus = 'Online' | 'Starting' | 'Restarting' | 'Degraded' | 'Stopped';

export type ActivityStatus = 'connected' | 'started' | 'stopped' | 'created';

export interface ActivityEntry {
  name: string;
  uuid: string;
  status: ActivityStatus;
  timestamp: string;
}

export interface DashboardTemplate {
  id: string;
  name: string;
  base: string;
  version: string;
  profile: string;
  javaVersion: string;
}

export interface CreateTemplateInput {
  name: string;
  base: string;
  version: string;
  profile: string;
  javaVersion: string;
}

export interface DashboardGroup {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  javaVersion: string;
  serviceType: GroupServiceType;
  minCount: number;
  maxCount: number;
  minMemory: number;
  maxMemory: number;
  maxPlayers: number;
  startNewPercent: number;
}

export interface CreateGroupInput {
  name: string;
  templateId: string;
  serviceType: GroupServiceType;
  minCount: number;
  maxCount: number;
  minMemory: number;
  maxMemory: number;
  maxPlayers: number;
  startNewPercent: number;
}

export interface DashboardService {
  id: string;
  name: string;
  groupId: string;
  groupName: string;
  templateName: string;
  serviceType: GroupServiceType;
  host: string;
  uptime: string;
  players: number;
  status: RuntimeServiceStatus;
  maxPlayers: number;
}

export interface CreateServiceInput {
  groupId: string;
  host: string;
  status: RuntimeServiceStatus;
  players: number;
}

export interface DashboardAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  lastSeen: string;
  access: string;
}

export interface SaveAccountInput {
  name: string;
  email: string;
  role: string;
  access: string;
}

export interface DashboardApiKey {
  id: string;
  label: string;
  scope: string;
  expires: string;
  owner: string;
}
