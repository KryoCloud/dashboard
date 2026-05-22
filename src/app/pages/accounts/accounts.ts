import { Component, inject } from '@angular/core';
import { DashboardDataService } from '../../dashboard-data.service';
import { SaveAccountInput } from '../../models';
import Swal from 'sweetalert2';
import { initCustomSelects, kryoSwal, modalFieldClass, modalLabelClass, renderCustomSelect } from '../../swal';
import { accountAccessBadgeClass, actionButtonClass, apiScopeBadgeClass } from '../../ui-tokens';

@Component({
  selector: 'app-accounts',
  host: {
    class: 'block'
  },
  imports: [],
  templateUrl: './accounts.html',
})
export class Accounts {
  private readonly data = inject(DashboardDataService);

  readonly members = this.data.accounts;
  readonly apiKeys = this.data.apiKeys;

  async openCreateAccountDialog(): Promise<void> {
    const result = await kryoSwal.fire<SaveAccountInput>({
      title: 'Create Account',
      confirmButtonText: 'Save account',
      showCancelButton: true,
      focusConfirm: false,
      didOpen: (popup) => initCustomSelects(popup as HTMLElement),
      html: `
        <div class="grid gap-4 md:grid-cols-2 text-left">
          <label>
            <span class="${modalLabelClass}">Name</span>
            <input id="account-name" class="${modalFieldClass}" placeholder="Avery" />
          </label>
          <label>
            <span class="${modalLabelClass}">Email</span>
            <input id="account-email" class="${modalFieldClass}" placeholder="avery@kryocloud.eu" />
          </label>
          <label>
            <span class="${modalLabelClass}">Role</span>
            <input id="account-role" class="${modalFieldClass}" value="Developer" placeholder="Developer" />
          </label>
          <label>
            <span class="${modalLabelClass}">Access</span>
            ${renderCustomSelect('account-access', `
              <option value="Full">Full</option>
              <option value="Deploy + Logs">Deploy + Logs</option>
              <option value="Deploy">Deploy</option>
              <option value="Read only" selected>Read only</option>
            `)}
          </label>
        </div>
      `,
      preConfirm: () => {
        const popup = Swal.getPopup();
        const name = (popup?.querySelector<HTMLInputElement>('#account-name')?.value ?? '').trim();
        const email = (popup?.querySelector<HTMLInputElement>('#account-email')?.value ?? '').trim();
        const role = (popup?.querySelector<HTMLInputElement>('#account-role')?.value ?? '').trim();
        const access = popup?.querySelector<HTMLInputElement>('#account-access')?.value ?? 'Read only';

        if (!name || !email) {
          Swal.showValidationMessage('Name and email are required.');
          return;
        }

        return { name, email, role, access };
      }
    });

    if (!result.isConfirmed || !result.value) {
      return;
    }

    await this.data.saveAccount(result.value);
  }

  async removeAccount(accountId: string): Promise<void> {
    await this.data.deleteAccount(accountId);
  }

  accessClass(access: string): string {
    return accountAccessBadgeClass(access);
  }

  lastSeenClass(lastSeen: string): string {
    const minutes = Number.parseInt(lastSeen, 10);
    if (minutes <= 10) {
      return 'text-emerald-200';
    }
    if (minutes <= 30) {
      return 'text-amber-100';
    }
    return 'text-slate-400';
  }

  keyScopeClass(scope: string): string {
    return apiScopeBadgeClass(scope);
  }

  actionButtonTone(variant: 'remove'): string {
    return actionButtonClass(variant);
  }

  expiryClass(expires: string): string {
    const expiresAt = new Date(expires);
    const now = new Date('2026-03-15T00:00:00');
    const days = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 90) {
      return 'text-rose-200';
    }
    if (days <= 150) {
      return 'text-amber-100';
    }
    return 'text-emerald-200';
  }
}
