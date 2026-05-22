import { Component, computed, effect, inject } from '@angular/core';
import { DashboardDataService } from '../../dashboard-data.service';
import { CreateGroupInput, GroupServiceType } from '../../models';
import Swal from 'sweetalert2';
import { initCustomSelects, kryoSwal, modalFieldClass, modalLabelClass, renderCustomSelect } from '../../swal';
import { actionButtonClass, serviceTypeBadgeClass } from '../../ui-tokens';

import type { DashboardGroup } from '../../models';

interface GroupSummary extends DashboardGroup {
  services: number;
}

@Component({
  selector: 'app-groups',
  host: {
    class: 'block'
  },
  imports: [],
  templateUrl: './groups.html',
})
export class Groups {
  private readonly data = inject(DashboardDataService);

  readonly groupRecords = this.data.groups;
  readonly templateRecords = this.data.templates;
  readonly serviceRecords = this.data.services;

  readonly groups = computed<GroupSummary[]>(() =>
    this.groupRecords().map((group) => ({
      ...group,
      services: this.serviceRecords().filter((service) => service.groupId === group.id && service.status !== 'STOPPED').length,
    }))
  );

  readonly totalServices = computed(() => this.serviceRecords().filter((service) => service.status !== 'STOPPED').length);
  readonly totalCapacity = computed(() => this.groups().reduce((total, group) => total + group.maxPlayers * group.services, 0));
  readonly maxAutoscaleThreshold = computed(() => Math.max(0, ...this.groupRecords().map((group) => group.startNewPercent)));
  readonly javaVersions = computed(() => [...new Set(this.groupRecords().map((group) => group.javaVersion))].join(', ') || 'n/a');

  private defaultTemplateName = '';

  constructor() {
    effect(() => {
      const templates = this.templateRecords();
      if (!this.defaultTemplateName && templates.length > 0) {
        this.defaultTemplateName = templates[0].name;
      }
    });
  }

  async openCreateGroupDialog(): Promise<void> {
    const templateOptions = this.templateRecords()
      .map((template) => `<option value="${template.name}" ${template.name === this.defaultTemplateName ? 'selected' : ''}>${template.name}</option>`)
      .join('');

    const result = await kryoSwal.fire<CreateGroupInput>({
      title: 'Create Group',
      confirmButtonText: 'Create group',
      showCancelButton: true,
      focusConfirm: false,
      didOpen: (popup) => initCustomSelects(popup as HTMLElement),
      html: `
        <div class="grid gap-4 md:grid-cols-2 text-left">
          <label class="md:col-span-2">
            <span class="${modalLabelClass}">Group name</span>
            <input id="group-name" class="${modalFieldClass}" placeholder="survival-eu" />
          </label>
          <label>
            <span class="${modalLabelClass}">Template</span>
            ${renderCustomSelect('group-template', templateOptions)}
          </label>
          <label>
            <span class="${modalLabelClass}">Service type</span>
            ${renderCustomSelect('group-type', `
              <option value="PROXY">PROXY</option>
              <option value="LOBBY">LOBBY</option>
              <option value="SERVER" selected>SERVER</option>
            `)}
          </label>
          <label>
            <span class="${modalLabelClass}">Java version</span>
            <input id="group-java" class="${modalFieldClass}" value="21" placeholder="21" />
          </label>
          <label>
            <span class="${modalLabelClass}">Min replicas</span>
            <input id="group-min-count" type="number" min="1" value="1" class="${modalFieldClass}" />
          </label>
          <label>
            <span class="${modalLabelClass}">Max replicas</span>
            <input id="group-max-count" type="number" min="1" value="2" class="${modalFieldClass}" />
          </label>
          <label>
            <span class="${modalLabelClass}">Min memory MB</span>
            <input id="group-min-memory" type="number" min="256" step="256" value="1024" class="${modalFieldClass}" />
          </label>
          <label>
            <span class="${modalLabelClass}">Max memory MB</span>
            <input id="group-max-memory" type="number" min="512" step="256" value="2048" class="${modalFieldClass}" />
          </label>
          <label>
            <span class="${modalLabelClass}">Max players</span>
            <input id="group-max-players" type="number" min="1" value="100" class="${modalFieldClass}" />
          </label>
          <label>
            <span class="${modalLabelClass}">Scale-out threshold %</span>
            <input id="group-scale" type="number" min="1" max="100" value="70" class="${modalFieldClass}" />
          </label>
        </div>
      `,
      preConfirm: () => {
        const popup = Swal.getPopup();
        const value = <T extends HTMLElement>(selector: string) => popup?.querySelector<T>(selector);
        const name = (value<HTMLInputElement>('#group-name')?.value ?? '').trim();
        const templateName = value<HTMLInputElement>('#group-template')?.value ?? '';
        const serviceType = (value<HTMLInputElement>('#group-type')?.value ?? 'SERVER') as GroupServiceType;
        const javaVersion = (value<HTMLInputElement>('#group-java')?.value ?? '21').trim();
        const minCount = Number(value<HTMLInputElement>('#group-min-count')?.value ?? 1);
        const maxCount = Number(value<HTMLInputElement>('#group-max-count')?.value ?? 2);
        const minMemory = Number(value<HTMLInputElement>('#group-min-memory')?.value ?? 1024);
        const maxMemory = Number(value<HTMLInputElement>('#group-max-memory')?.value ?? 2048);
        const maxPlayers = Number(value<HTMLInputElement>('#group-max-players')?.value ?? 100);
        const startNewPercent = Number(value<HTMLInputElement>('#group-scale')?.value ?? 70);

        if (!name || !templateName) {
          Swal.showValidationMessage('Name and template are required.');
          return;
        }

        if (maxCount < minCount) {
          Swal.showValidationMessage('Max replicas must be greater than or equal to min replicas.');
          return;
        }

        if (maxMemory < minMemory) {
          Swal.showValidationMessage('Max memory must be greater than or equal to min memory.');
          return;
        }

        return { name, templateName, javaVersion, serviceType, minCount, maxCount, minMemory, maxMemory, maxPlayers, startNewPercent };
      }
    });

    if (!result.isConfirmed || !result.value) {
      return;
    }

    await this.data.createGroup(result.value);
  }

  async startService(groupId: string): Promise<void> {
    await this.data.startServiceFromGroup(groupId);
  }

  serviceTypeTone(serviceType: GroupServiceType): string {
    return serviceTypeBadgeClass(serviceType);
  }

  actionButtonTone(variant: 'start'): string {
    return actionButtonClass(variant);
  }

  scaleTone(percent: number): string {
    if (percent >= 78) {
      return 'bg-linear-to-r from-rose-300 to-orange-400';
    }
    if (percent >= 70) {
      return 'bg-linear-to-r from-amber-200 to-orange-300';
    }
    return 'bg-linear-to-r from-cyan-300 to-sky-500';
  }

  replicaFill(group: GroupSummary): number {
    return Math.round((group.services / group.maxCount) * 100);
  }
}
