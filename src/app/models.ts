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

/** Maps to CloudServiceState in kryocloud-network */
export type CloudServiceState = 'PREPARING' | 'STARTING' | 'RUNNING' | 'STOPPING' | 'STOPPED' | 'FAILED';

/** Maps to WrapperState in kryocloud-network */
export type WrapperState = 'STARTING' | 'AVAILABLE' | 'BUSY' | 'DRAINING' | 'OFFLINE';

export type ActivityStatus = 'connected' | 'started' | 'stopped' | 'created';

export interface ActivityEntry {
  name: string;
  uuid: string;
  status: ActivityStatus;
  timestamp: string;
}

/** Maps to ITemplate — templates are filesystem directories on the node */
export interface DashboardTemplate {
  id: string;
  name: string;
  path: string;
}

export interface CreateTemplateInput {
  name: string;
  path: string;
}

/** Maps to IGroup */
export interface DashboardGroup {
  id: string;
  name: string;
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

/** Maps to IService + CloudServiceState from ServiceStatePacket */
export interface DashboardService {
  id: string;
  name: string;
  serviceNumber: number;
  groupId: string;
  groupName: string;
  templateName: string;
  javaVersion: string;
  serviceType: GroupServiceType;
  host: string;
  port: number;
  uptime: string;
  players: number;
  status: CloudServiceState;
  maxPlayers: number;
  minMemory: number;
  maxMemory: number;
  staticService: boolean;
}

export interface CreateServiceInput {
  groupId: string;
  host: string;
  status: CloudServiceState;
  players: number;
}

/** Maps to WrapperSnapshot in kryocloud-node */
export interface WrapperInfo {
  id: string;
  hostname: string;
  address: string;
  osName: string;
  availableProcessors: number;
  maxMemoryMb: number;
  usedMemoryMb: number;
  runningServices: number;
  state: WrapperState;
  registeredAtMillis: number;
  lastHeartbeatAtMillis: number;
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
