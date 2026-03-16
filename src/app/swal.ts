import Swal from 'sweetalert2';

export const modalFieldClass = 'mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/30';
export const modalSelectClass = `${modalFieldClass} appearance-none pr-12`;
export const modalLabelClass = 'mb-1 block text-xs uppercase tracking-[0.16em] text-slate-500';

export function renderModalSelect(id: string, optionsHtml: string, extraAttributes = ''): string {
  return `
    <div class="relative mt-1">
      <select id="${id}" class="${modalSelectClass}" ${extraAttributes}>${optionsHtml}</select>
      <span class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" class="h-4 w-4" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="m6 8 4 4 4-4" />
        </svg>
      </span>
    </div>
  `;
}

export const kryoSwal = Swal.mixin({
  background: '#020617',
  color: '#e2e8f0',
  buttonsStyling: false,
  reverseButtons: true,
  customClass: {
    popup: 'rounded-[28px] border border-white/10 bg-slate-950 text-slate-100 shadow-[0_24px_80px_rgba(2,6,23,0.65)]',
    title: 'text-left text-2xl font-semibold text-white',
    htmlContainer: 'text-left text-sm text-slate-300',
    actions: 'mt-6 flex gap-3',
    confirmButton: 'inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/12 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/18',
    cancelButton: 'inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/8',
    closeButton: 'text-slate-500',
    validationMessage: 'mt-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100'
  },
});