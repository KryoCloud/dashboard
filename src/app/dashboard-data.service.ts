import { Injectable, computed, signal } from '@angular/core';
import {
  ActivityEntry,
  CloudServiceState,
  CreateGroupInput,
  CreateServiceInput,
  CreateTemplateInput,
  DashboardAccount,
  DashboardApiKey,
  DashboardGroup,
  DashboardService,
  DashboardTemplate,
  SaveAccountInput,
  WrapperInfo,
  WrapperState,
} from './models';

const STORAGE_KEYS = {
  templates: 'kryocloud.templates',
  groups: 'kryocloud.groups',
  services: 'kryocloud.services',
  accounts: 'kryocloud.accounts',
  apiKeys: 'kryocloud.apiKeys',
  activity: 'kryocloud.activity',
  wrappers: 'kryocloud.wrappers',
} as const;

const TEMPLATE_SEED: DashboardTemplate[] = [
  { id: 'tpl-gateway-gold', name: 'gateway-gold', path: 'templates/gateway-gold' },
  { id: 'tpl-api-balanced', name: 'api-balanced', path: 'templates/api-balanced' },
  { id: 'tpl-worker-thin', name: 'worker-thin', path: 'templates/worker-thin' },
  { id: 'tpl-cache-fast', name: 'cache-fast', path: 'templates/cache-fast' },
];

const GROUP_SEED: DashboardGroup[] = [
  {
    id: 'grp-proxy-core',
    name: 'proxy-core',
    templateName: 'gateway-gold',
    javaVersion: '21',
    serviceType: 'PROXY',
    minCount: 2,
    maxCount: 5,
    minMemory: 512,
    maxMemory: 1024,
    maxPlayers: 500,
    startNewPercent: 72,
  },
  {
    id: 'grp-lobby-eu',
    name: 'lobby-eu',
    templateName: 'api-balanced',
    javaVersion: '21',
    serviceType: 'LOBBY',
    minCount: 1,
    maxCount: 3,
    minMemory: 1024,
    maxMemory: 2048,
    maxPlayers: 220,
    startNewPercent: 80,
  },
  {
    id: 'grp-survival',
    name: 'survival',
    templateName: 'worker-thin',
    javaVersion: '21',
    serviceType: 'SERVER',
    minCount: 4,
    maxCount: 10,
    minMemory: 2048,
    maxMemory: 4096,
    maxPlayers: 120,
    startNewPercent: 68,
  },
  {
    id: 'grp-bedwars',
    name: 'bedwars',
    templateName: 'cache-fast',
    javaVersion: '17',
    serviceType: 'SERVER',
    minCount: 2,
    maxCount: 8,
    minMemory: 1536,
    maxMemory: 3072,
    maxPlayers: 64,
    startNewPercent: 75,
  },
];

const SERVICE_SEED: DashboardService[] = [
  { id: 'svc-proxy-01', serviceNumber: 1, name: 'proxy-core-01', groupId: 'grp-proxy-core', groupName: 'proxy-core', templateName: 'gateway-gold', javaVersion: '21', serviceType: 'PROXY', host: 'eu-edge-01', port: 25577, uptime: '12d 4h', players: 182, status: 'RUNNING', maxPlayers: 500, minMemory: 512, maxMemory: 1024, staticService: false },
  { id: 'svc-proxy-02', serviceNumber: 2, name: 'proxy-core-02', groupId: 'grp-proxy-core', groupName: 'proxy-core', templateName: 'gateway-gold', javaVersion: '21', serviceType: 'PROXY', host: 'eu-edge-02', port: 25578, uptime: '9d 3h', players: 164, status: 'RUNNING', maxPlayers: 500, minMemory: 512, maxMemory: 1024, staticService: false },
  { id: 'svc-lobby-01', serviceNumber: 1, name: 'lobby-eu-01', groupId: 'grp-lobby-eu', groupName: 'lobby-eu', templateName: 'api-balanced', javaVersion: '21', serviceType: 'LOBBY', host: 'eu-lobby-01', port: 25565, uptime: '3d 18h', players: 96, status: 'STOPPING', maxPlayers: 220, minMemory: 1024, maxMemory: 2048, staticService: false },
  { id: 'svc-survival-01', serviceNumber: 1, name: 'survival-01', groupId: 'grp-survival', groupName: 'survival', templateName: 'worker-thin', javaVersion: '21', serviceType: 'SERVER', host: 'play-survival-01', port: 25565, uptime: '22d 6h', players: 48, status: 'RUNNING', maxPlayers: 120, minMemory: 2048, maxMemory: 4096, staticService: false },
  { id: 'svc-bedwars-01', serviceNumber: 1, name: 'bedwars-01', groupId: 'grp-bedwars', groupName: 'bedwars', templateName: 'cache-fast', javaVersion: '17', serviceType: 'SERVER', host: 'play-bedwars-01', port: 25565, uptime: '31d 9h', players: 0, status: 'FAILED', maxPlayers: 64, minMemory: 1536, maxMemory: 3072, staticService: false },
];

const WRAPPER_SEED: WrapperInfo[] = [
  { id: 'wrap-eu-01', hostname: 'eu-node-01', address: '10.0.1.10', osName: 'Linux', availableProcessors: 8, maxMemoryMb: 8192, usedMemoryMb: 3412, runningServices: 3, state: 'AVAILABLE', registeredAtMillis: Date.now() - 86400000, lastHeartbeatAtMillis: Date.now() - 2000 },
  { id: 'wrap-eu-02', hostname: 'eu-node-02', address: '10.0.1.11', osName: 'Linux', availableProcessors: 4, maxMemoryMb: 4096, usedMemoryMb: 3900, runningServices: 2, state: 'BUSY', registeredAtMillis: Date.now() - 43200000, lastHeartbeatAtMillis: Date.now() - 3500 },
  { id: 'wrap-us-01', hostname: 'us-node-01', address: '10.1.1.10', osName: 'Linux', availableProcessors: 16, maxMemoryMb: 16384, usedMemoryMb: 1024, runningServices: 0, state: 'DRAINING', registeredAtMillis: Date.now() - 172800000, lastHeartbeatAtMillis: Date.now() - 8000 },
];

const ACCOUNT_SEED: DashboardAccount[] = [
  { id: 'acc-flip', name: 'Flip', email: 'flip@kryocloud.eu', role: 'Platform Admin', lastSeen: '1m ago', access: 'Full' },
  { id: 'acc-nina', name: 'Nina', email: 'nina@kryocloud.eu', role: 'SRE', lastSeen: '9m ago', access: 'Deploy + Logs' },
  { id: 'acc-marco', name: 'Marco', email: 'marco@kryocloud.eu', role: 'Backend', lastSeen: '22m ago', access: 'Deploy' },
  { id: 'acc-iris', name: 'Iris', email: 'iris@kryocloud.eu', role: 'Support', lastSeen: '46m ago', access: 'Read only' },
];

const API_KEY_SEED: DashboardApiKey[] = [
  { id: 'key-ci-prod', label: 'ci-prod', scope: 'deploy:write', expires: '2026-09-01', owner: 'Flip' },
  { id: 'key-ops-metrics', label: 'ops-metrics', scope: 'metrics:read', expires: '2026-06-14', owner: 'Nina' },
  { id: 'key-support-view', label: 'support-view', scope: 'logs:read', expires: '2026-05-21', owner: 'Iris' },
];

const ACTIVITY_SEED: ActivityEntry[] = [
  { name: 'proxy-core-01', uuid: 'svc-proxy-01', status: 'started', timestamp: '15/03/2026, 09:05:14' },
  { name: 'lobby-eu-01', uuid: 'svc-lobby-01', status: 'connected', timestamp: '15/03/2026, 09:04:09' },
  { name: 'survival', uuid: 'grp-survival', status: 'created', timestamp: '15/03/2026, 08:58:22' },
  { name: 'bedwars-01', uuid: 'svc-bedwars-01', status: 'stopped', timestamp: '15/03/2026, 08:55:58' },
  { name: 'gateway-gold', uuid: 'tpl-gateway-gold', status: 'created', timestamp: '15/03/2026, 08:53:17' },
];

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  private simulationHandle?: number;

  private readonly templatesState = signal<DashboardTemplate[]>(this.readCollection(STORAGE_KEYS.templates, TEMPLATE_SEED));
  private readonly groupsState = signal<DashboardGroup[]>(this.readCollection(STORAGE_KEYS.groups, GROUP_SEED));
  private readonly servicesState = signal<DashboardService[]>(this.readCollection(STORAGE_KEYS.services, SERVICE_SEED));
  private readonly accountsState = signal<DashboardAccount[]>(this.readCollection(STORAGE_KEYS.accounts, ACCOUNT_SEED));
  private readonly apiKeysState = signal<DashboardApiKey[]>(this.readCollection(STORAGE_KEYS.apiKeys, API_KEY_SEED));
  private readonly activityState = signal<ActivityEntry[]>(this.readCollection(STORAGE_KEYS.activity, ACTIVITY_SEED));
  private readonly wrappersState = signal<WrapperInfo[]>(this.readCollection(STORAGE_KEYS.wrappers, WRAPPER_SEED));

  readonly templates = this.templatesState.asReadonly();
  readonly groups = this.groupsState.asReadonly();
  readonly services = this.servicesState.asReadonly();
  readonly accounts = this.accountsState.asReadonly();
  readonly apiKeys = this.apiKeysState.asReadonly();
  readonly wrappers = this.wrappersState.asReadonly();
  readonly activityEntries = computed(() => this.activityState().slice(0, 12));

  constructor() {
    this.startRuntimeSimulation();
  }

  async getTemplates(): Promise<DashboardTemplate[]> {
    return this.clone(this.templatesState());
  }

  async createTemplate(input: CreateTemplateInput): Promise<DashboardTemplate> {
    const template: DashboardTemplate = {
      id: this.nextId('tpl'),
      name: input.name.trim(),
      path: input.path.trim() || `templates/${input.name.trim()}`,
    };

    this.templatesState.update((templates) => [template, ...templates]);
    this.persist(STORAGE_KEYS.templates, this.templatesState());
    this.pushActivity(template.name, 'created', template.id);
    return this.clone(template);
  }

  async getGroups(): Promise<DashboardGroup[]> {
    return this.clone(this.groupsState());
  }

  async createGroup(input: CreateGroupInput): Promise<DashboardGroup> {
    const template = this.templatesState().find((item) => item.name === input.templateName);
    if (!template) {
      throw new Error('Template not found');
    }

    const group: DashboardGroup = {
      id: this.nextId('grp'),
      name: input.name.trim(),
      templateName: template.name,
      javaVersion: input.javaVersion.trim() || '21',
      serviceType: input.serviceType,
      minCount: Number(input.minCount),
      maxCount: Number(input.maxCount),
      minMemory: Number(input.minMemory),
      maxMemory: Number(input.maxMemory),
      maxPlayers: Number(input.maxPlayers),
      startNewPercent: Number(input.startNewPercent),
    };

    this.groupsState.update((groups) => [group, ...groups]);
    this.persist(STORAGE_KEYS.groups, this.groupsState());
    this.pushActivity(group.name, 'created', group.id);
    return this.clone(group);
  }

  async getServices(): Promise<DashboardService[]> {
    return this.clone(this.servicesState());
  }

  async createService(input: CreateServiceInput, activityStatus: ActivityEntry['status'] = 'created'): Promise<DashboardService> {
    const group = this.groupsState().find((item) => item.id === input.groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    const siblingCount = this.servicesState().filter((service) => service.groupId === group.id).length + 1;
    const status = input.status;
    const players = this.clampPlayers(input.players, group.maxPlayers);
    const service: DashboardService = {
      id: this.nextId('svc'),
      serviceNumber: siblingCount,
      name: `${group.name}-${String(siblingCount).padStart(2, '0')}`,
      groupId: group.id,
      groupName: group.name,
      templateName: group.templateName,
      javaVersion: group.javaVersion,
      serviceType: group.serviceType,
      host: input.host.trim() || `${group.name}.${group.serviceType.toLowerCase()}.local`,
      port: 25565,
      uptime: '0m',
      players: status === 'STOPPED' ? 0 : players,
      status,
      maxPlayers: group.maxPlayers,
      minMemory: group.minMemory,
      maxMemory: group.maxMemory,
      staticService: false,
    };

    this.servicesState.update((services) => [service, ...services]);
    this.persist(STORAGE_KEYS.services, this.servicesState());
    this.pushActivity(service.name, activityStatus, service.id);
    return this.clone(service);
  }

  async startServiceFromGroup(groupId: string): Promise<DashboardService> {
    return this.createService({ groupId, host: '', status: 'STARTING', players: 0 }, 'started');
  }

  async startService(serviceId: string): Promise<DashboardService> {
    return this.updateService(serviceId, (service) => ({
      ...service,
      status: 'STARTING' as CloudServiceState,
      players: 0,
      uptime: '0m',
    }), 'started');
  }

  async restartService(serviceId: string): Promise<DashboardService> {
    return this.updateService(serviceId, (service) => ({
      ...service,
      status: 'STOPPING' as CloudServiceState,
      players: Math.min(service.players, 2),
    }), 'started');
  }

  async stopService(serviceId: string): Promise<DashboardService> {
    return this.updateService(serviceId, (service) => ({
      ...service,
      status: 'STOPPED' as CloudServiceState,
      players: 0,
    }), 'stopped');
  }

  async deleteService(serviceId: string): Promise<void> {
    const service = this.servicesState().find((item) => item.id === serviceId);
    this.servicesState.update((services) => services.filter((item) => item.id !== serviceId));
    this.persist(STORAGE_KEYS.services, this.servicesState());
    if (service) {
      this.pushActivity(service.name, 'stopped', service.id);
    }
  }

  async getAccounts(): Promise<DashboardAccount[]> {
    return this.clone(this.accountsState());
  }

  async saveAccount(input: SaveAccountInput): Promise<DashboardAccount> {
    const account: DashboardAccount = {
      id: this.nextId('acc'),
      name: input.name.trim(),
      email: input.email.trim(),
      role: input.role.trim(),
      access: input.access.trim(),
      lastSeen: '0m ago',
    };

    this.accountsState.update((accounts) => [account, ...accounts]);
    this.persist(STORAGE_KEYS.accounts, this.accountsState());
    this.pushActivity(account.name, 'created', account.id);
    return this.clone(account);
  }

  async deleteAccount(accountId: string): Promise<void> {
    const account = this.accountsState().find((item) => item.id === accountId);
    this.accountsState.update((accounts) => accounts.filter((item) => item.id !== accountId));
    this.persist(STORAGE_KEYS.accounts, this.accountsState());
    if (account) {
      this.pushActivity(account.name, 'stopped', account.id);
    }
  }

  async getApiKeys(): Promise<DashboardApiKey[]> {
    return this.clone(this.apiKeysState());
  }

  private pushActivity(name: string, status: ActivityEntry['status'], uuid: string): void {
    const entry: ActivityEntry = {
      name,
      uuid,
      status,
      timestamp: new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date()),
    };

    this.activityState.update((entries) => [entry, ...entries].slice(0, 20));
    this.persist(STORAGE_KEYS.activity, this.activityState());
  }

  private updateService(
    serviceId: string,
    updater: (service: DashboardService) => DashboardService,
    activityStatus: ActivityEntry['status']
  ): Promise<DashboardService> {
    const current = this.servicesState().find((item) => item.id === serviceId);
    if (!current) {
      throw new Error('Service not found');
    }

    const updated = updater(current);
    this.servicesState.update((services) => services.map((item) => (item.id === serviceId ? updated : item)));
    this.persist(STORAGE_KEYS.services, this.servicesState());
    this.pushActivity(updated.name, activityStatus, updated.id);
    return Promise.resolve(this.clone(updated));
  }

  private startRuntimeSimulation(): void {
    if (typeof window === 'undefined' || this.simulationHandle) {
      return;
    }

    this.simulationHandle = window.setInterval(() => {
      this.simulateRuntimeTick();
    }, 5000);
  }

  private simulateRuntimeTick(): void {
    let changed = false;

    const next = this.servicesState().map((service) => {
      if (service.status === 'STOPPED') {
        return service;
      }

      let status = service.status;
      let players = service.players;
      let uptime = service.uptime;
      let serviceChanged = false;

      if (status === 'PREPARING') {
        status = 'STARTING';
        serviceChanged = true;
      } else if (status === 'STARTING') {
        status = 'RUNNING';
        players = this.randomInt(0, Math.min(5, service.maxPlayers));
        uptime = '0m';
        serviceChanged = true;
      } else if (status === 'STOPPING') {
        if (Math.random() < 0.8) {
          status = 'RUNNING';
          players = this.randomInt(0, Math.min(5, service.maxPlayers));
          uptime = '0m';
          serviceChanged = true;
        }
      } else {
        const nextPlayers = this.clampPlayers(service.players + this.randomSignedDelta(), service.maxPlayers);
        if (nextPlayers !== service.players) {
          players = nextPlayers;
          serviceChanged = true;
        }

        if (status === 'RUNNING') {
          const roll = Math.random();
          if (roll < 0.05) {
            status = 'STOPPING';
            players = Math.min(players, 2);
            serviceChanged = true;
          } else if (roll < 0.09) {
            status = 'FAILED';
            serviceChanged = true;
          }
        } else if (status === 'FAILED' && Math.random() < 0.35) {
          status = 'RUNNING';
          serviceChanged = true;
        }

        const nextUptime = this.bumpUptime(service.uptime, serviceChanged ? 1 : 5);
        if (nextUptime !== service.uptime) {
          uptime = nextUptime;
          serviceChanged = true;
        }
      }

      if (!serviceChanged) {
        return service;
      }

      changed = true;
      return { ...service, status, players, uptime };
    });

    if (!changed) {
      return;
    }

    this.servicesState.set(next);
    this.persist(STORAGE_KEYS.services, this.servicesState());
  }

  private readCollection<T>(key: string, fallback: T[]): T[] {
    if (typeof localStorage === 'undefined') {
      return this.clone(fallback);
    }

    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return this.clone(fallback);
    }

    try {
      return JSON.parse(raw) as T[];
    } catch {
      localStorage.setItem(key, JSON.stringify(fallback));
      return this.clone(fallback);
    }
  }

  private persist<T>(key: string, value: T[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  }

  private nextId(prefix: string): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }

  private clampPlayers(players: number, maxPlayers: number): number {
    return Math.max(0, Math.min(maxPlayers, Math.round(players)));
  }

  private randomSignedDelta(): number {
    const amount = this.randomInt(1, 5);
    return Math.random() < 0.5 ? -amount : amount;
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private bumpUptime(current: string, minutesToAdd: number): string {
    const totalMinutes = this.parseUptimeToMinutes(current) + minutesToAdd;
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) {
      return `${days}d ${hours}h`;
    }

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  }

  private parseUptimeToMinutes(value: string): number {
    let minutes = 0;
    const dayMatch = value.match(/(\d+)d/);
    const hourMatch = value.match(/(\d+)h/);
    const minuteMatch = value.match(/(\d+)m/);

    if (dayMatch) {
      minutes += Number(dayMatch[1]) * 24 * 60;
    }

    if (hourMatch) {
      minutes += Number(hourMatch[1]) * 60;
    }

    if (minuteMatch) {
      minutes += Number(minuteMatch[1]);
    }

    return minutes;
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}