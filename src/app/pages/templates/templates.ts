import { Component, inject } from '@angular/core';
import { DashboardDataService } from '../../dashboard-data.service';
import { CreateTemplateInput } from '../../models';
import Swal from 'sweetalert2';
import { kryoSwal, modalFieldClass, modalLabelClass, renderModalSelect } from '../../swal';

@Component({
  selector: 'app-templates',
  host: {
    class: 'block'
  },
  imports: [],
  templateUrl: './templates.html',
})
export class Templates {
  private readonly data = inject(DashboardDataService);

  readonly templateRecords = this.data.templates;

  readonly launchProfiles = [
    { title: 'Low Cost', cpu: '2 vCPU', ram: '2 GB', disk: '20 GB NVMe' },
    { title: 'Balanced', cpu: '4 vCPU', ram: '8 GB', disk: '60 GB NVMe' },
    { title: 'Burst', cpu: '8 vCPU', ram: '16 GB', disk: '120 GB NVMe' },
  ];

  async openCreateTemplateDialog(): Promise<void> {
    const result = await kryoSwal.fire<CreateTemplateInput>({
      title: 'Create Template',
      confirmButtonText: 'Create template',
      showCancelButton: true,
      focusConfirm: false,
      html: `
        <div class="grid gap-4 md:grid-cols-2 text-left">
          <label>
            <span class="${modalLabelClass}">Template name</span>
            <input id="template-name" class="${modalFieldClass}" placeholder="paper-survival" />
          </label>
          <label>
            <span class="${modalLabelClass}">Version</span>
            <input id="template-version" class="${modalFieldClass}" placeholder="1.0.0" />
          </label>
          <label>
            <span class="${modalLabelClass}">Base image</span>
            ${renderModalSelect('template-base', `
              <option value="ubuntu-22.04">ubuntu-22.04</option>
              <option value="debian-12">debian-12</option>
              <option value="alpine-3.20">alpine-3.20</option>
            `)}
          </label>
          <label>
            <span class="${modalLabelClass}">Java version</span>
            <input id="template-java" class="${modalFieldClass}" value="21" placeholder="21" />
          </label>
          <label class="md:col-span-2">
            <span class="${modalLabelClass}">Profile</span>
            <input id="template-profile" class="${modalFieldClass}" placeholder="network edge" />
          </label>
        </div>
      `,
      preConfirm: () => {
        const popup = Swal.getPopup();
        const name = (popup?.querySelector<HTMLInputElement>('#template-name')?.value ?? '').trim();
        const version = (popup?.querySelector<HTMLInputElement>('#template-version')?.value ?? '').trim();
        const base = popup?.querySelector<HTMLSelectElement>('#template-base')?.value ?? 'ubuntu-22.04';
        const javaVersion = (popup?.querySelector<HTMLInputElement>('#template-java')?.value ?? '21').trim();
        const profile = (popup?.querySelector<HTMLInputElement>('#template-profile')?.value ?? '').trim();

        if (!name || !version || !profile) {
          Swal.showValidationMessage('Name, version, and profile are required.');
          return;
        }

        return { name, version, base, javaVersion, profile };
      }
    });

    if (!result.isConfirmed || !result.value) {
      return;
    }

    await this.data.createTemplate(result.value);
  }

  baseClass(base: string): string {
    if (base.includes('ubuntu')) {
      return 'border-orange-300/20 bg-orange-300/10 text-orange-100';
    }
    if (base.includes('debian')) {
      return 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100';
    }
    return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100';
  }

  profileClass(profile: string): string {
    if (profile.includes('network')) {
      return 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200';
    }
    if (profile.includes('rest')) {
      return 'border-indigo-400/20 bg-indigo-400/10 text-indigo-200';
    }
    if (profile.includes('background')) {
      return 'border-violet-400/20 bg-violet-400/10 text-violet-200';
    }
    return 'border-amber-300/20 bg-amber-300/10 text-amber-100';
  }

  launchProfileClass(title: string): string {
    if (title === 'Low Cost') {
      return 'border-slate-400/20 bg-slate-400/10 text-slate-200';
    }
    if (title === 'Balanced') {
      return 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100';
    }
    return 'border-orange-300/20 bg-orange-300/10 text-orange-100';
  }

  launchProfileFill(title: string): number {
    if (title === 'Low Cost') {
      return 35;
    }
    if (title === 'Balanced') {
      return 62;
    }
    return 100;
  }
}
