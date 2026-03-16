import { Component, computed, inject } from '@angular/core';
import { DashboardDataService } from '../../dashboard-data.service';
import { DashboardService, GroupServiceType, RuntimeServiceStatus } from '../../models';
import Swal from 'sweetalert2';
import { kryoSwal, modalFieldClass, modalLabelClass, renderModalSelect } from '../../swal';
import { actionButtonClass, runtimeStatusBadgeClass, serviceTypeBadgeClass } from '../../ui-tokens';

@Component({
  selector: 'app-services',
  host: {
    class: 'block'
  },
  imports: [],
  templateUrl: './servers.html',
})
export class Services {
  private readonly data = inject(DashboardDataService);

  readonly services = this.data.services;
  readonly groups = this.data.groups;

  readonly totalServices = computed(() => this.services().length);
  readonly onlineServices = computed(() => this.services().filter((service) => service.status === 'Online').length);
  readonly bootingServices = computed(() => this.services().filter((service) => service.status === 'Starting' || service.status === 'Restarting').length);
  readonly affectedServices = computed(() => this.services().filter((service) => service.status === 'Degraded' || service.status === 'Stopped').length);
  readonly groupPools = computed(() =>
    this.groups().map((group) => ({
      id: group.id,
      name: group.name,
      serviceType: group.serviceType,
      services: this.services().filter((service) => service.groupId === group.id && service.status !== 'Stopped').length,
      templateName: group.templateName,
    }))
  );

  async openCreateServiceDialog(): Promise<void> {
    const groups = this.groups();
    if (groups.length === 0) {
      await kryoSwal.fire({
        title: 'No Groups Available',
        text: 'Create a group first before launching a service.',
        confirmButtonText: 'Close',
      });
      return;
    }

    const groupOptions = groups
      .map((group, index) => `<option value="${group.id}" ${index === 0 ? 'selected' : ''}>${group.name} · ${group.serviceType}</option>`)
      .join('');

    const result = await kryoSwal.fire<{ groupId: string; host: string; status: RuntimeServiceStatus; players: number }>({
      title: 'Launch Service',
      confirmButtonText: 'Create service',
      showCancelButton: true,
      focusConfirm: false,
      html: `
        <div class="grid gap-4 text-left">
          <label>
            <span class="${modalLabelClass}">Group</span>
            ${renderModalSelect('service-group', groupOptions)}
          </label>
          <label>
            <span class="${modalLabelClass}">Host</span>
            <input id="service-host" class="${modalFieldClass}" placeholder="leave empty for automatic host" />
          </label>
          <div class="grid gap-4 md:grid-cols-2">
            <label>
              <span class="${modalLabelClass}">Initial status</span>
              ${renderModalSelect('service-status', `
                <option value="Starting" selected>Starting</option>
                <option value="Online">Online</option>
                <option value="Stopped">Stopped</option>
              `)}
            </label>
            <label>
              <span class="${modalLabelClass}">Initial players</span>
              <input id="service-players" type="number" min="0" value="0" class="${modalFieldClass}" />
            </label>
          </div>
        </div>
      `,
      preConfirm: () => {
        const popup = Swal.getPopup();
        const groupId = popup?.querySelector<HTMLSelectElement>('#service-group')?.value ?? '';
        const host = (popup?.querySelector<HTMLInputElement>('#service-host')?.value ?? '').trim();
        const status = (popup?.querySelector<HTMLSelectElement>('#service-status')?.value ?? 'Starting') as RuntimeServiceStatus;
        const players = Number(popup?.querySelector<HTMLInputElement>('#service-players')?.value ?? 0);

        if (!groupId) {
          Swal.showValidationMessage('A target group is required.');
          return;
        }

        if (!Number.isFinite(players) || players < 0) {
          Swal.showValidationMessage('Initial players must be zero or greater.');
          return;
        }

        return { groupId, host, status, players };
      }
    });

    if (!result.isConfirmed || !result.value) {
      return;
    }

    await this.data.createService(result.value, result.value.status === 'Stopped' ? 'created' : 'started');
  }

  async startService(serviceId: string): Promise<void> {
    await this.data.startService(serviceId);
  }

  async restartService(serviceId: string): Promise<void> {
    await this.data.restartService(serviceId);
  }

  async stopService(service: DashboardService): Promise<void> {
    const result = await kryoSwal.fire({
      title: `Stop ${service.name}?`,
      text: 'The service will remain registered but stop accepting player traffic.',
      confirmButtonText: 'Stop service',
      showCancelButton: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    await this.data.stopService(service.id);
  }

  async deleteService(service: DashboardService): Promise<void> {
    const result = await kryoSwal.fire({
      title: `Delete ${service.name}?`,
      text: 'This removes the service entry from the local registry.',
      confirmButtonText: 'Delete service',
      showCancelButton: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    await this.data.deleteService(service.id);
  }

  serverStatusClass(status: string): string {
    return runtimeStatusBadgeClass(status as RuntimeServiceStatus);
  }

  serviceTypeClass(serviceType: GroupServiceType): string {
    return serviceTypeBadgeClass(serviceType);
  }

  actionButtonTone(variant: 'start' | 'restart' | 'stop' | 'delete'): string {
    return actionButtonClass(variant);
  }

  playerLoad(service: DashboardService): number {
    return Math.min(100, Math.round((service.players / Math.max(service.maxPlayers, 1)) * 100));
  }

  playerLoadClass(load: number): string {
    if (load >= 75) {
      return 'bg-linear-to-r from-orange-300 to-rose-400';
    }
    if (load >= 40) {
      return 'bg-linear-to-r from-cyan-300 to-sky-500';
    }
    return 'bg-linear-to-r from-emerald-300 to-cyan-400';
  }
}
