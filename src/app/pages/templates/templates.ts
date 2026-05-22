import { Component, inject } from '@angular/core';
import { DashboardDataService } from '../../dashboard-data.service';
import { CreateTemplateInput } from '../../models';
import Swal from 'sweetalert2';
import { kryoSwal, modalFieldClass, modalLabelClass } from '../../swal';

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

  async openCreateTemplateDialog(): Promise<void> {
    const result = await kryoSwal.fire<CreateTemplateInput>({
      title: 'Create Template',
      confirmButtonText: 'Create template',
      showCancelButton: true,
      focusConfirm: false,
      html: `
        <div class="grid gap-4 text-left">
          <label>
            <span class="${modalLabelClass}">Template name</span>
            <input id="template-name" class="${modalFieldClass}" placeholder="paper-survival" />
          </label>
          <label>
            <span class="${modalLabelClass}">Path</span>
            <input id="template-path" class="${modalFieldClass}" placeholder="templates/paper-survival" />
          </label>
        </div>
      `,
      preConfirm: () => {
        const popup = Swal.getPopup();
        const name = (popup?.querySelector<HTMLInputElement>('#template-name')?.value ?? '').trim();
        const path = (popup?.querySelector<HTMLInputElement>('#template-path')?.value ?? '').trim();

        if (!name) {
          Swal.showValidationMessage('Template name is required.');
          return;
        }

        return { name, path: path || `templates/${name}` };
      }
    });

    if (!result.isConfirmed || !result.value) {
      return;
    }

    await this.data.createTemplate(result.value);
  }

}
