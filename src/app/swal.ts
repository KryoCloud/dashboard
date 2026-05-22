import Swal from 'sweetalert2';

export const modalFieldClass = 'mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/30';
export const modalLabelClass = 'mb-1 block text-xs uppercase tracking-[0.16em] text-slate-500';

interface ParsedOption {
  value: string;
  label: string;
  selected: boolean;
}

function parseOptions(html: string): ParsedOption[] {
  return [...html.matchAll(/<option\s+value="([^"]*)"([^>]*)>([\s\S]*?)<\/option>/g)].map((m) => ({
    value: m[1],
    label: m[3].trim(),
    selected: m[2].includes('selected'),
  }));
}

const optBase = 'kryo-opt flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer transition';
const optInactive = `${optBase} text-slate-200 hover:bg-white/8`;
const optActive = `${optBase} text-cyan-200 bg-cyan-400/10`;

export function renderCustomSelect(id: string, optionsHtml: string): string {
  const options = parseOptions(optionsHtml);
  const selected = options.find((o) => o.selected) ?? options[0];

  const items = options
    .map(
      (opt) =>
        `<div class="${opt.value === selected?.value ? optActive : optInactive}" data-v="${opt.value}" data-l="${opt.label}">
          <span class="kryo-opt-dot h-1.5 w-1.5 rounded-full ${opt.value === selected?.value ? 'bg-cyan-400' : 'bg-transparent'}"></span>
          ${opt.label}
        </div>`,
    )
    .join('');

  return `
    <div class="mt-1 kryo-select">
      <button type="button" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-left text-white flex items-center justify-between gap-2 transition hover:border-white/20 focus:border-cyan-400/30 focus:outline-none kryo-trigger">
        <span class="kryo-label">${selected?.label ?? ''}</span>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" class="h-4 w-4 shrink-0 text-slate-500 transition-transform kryo-chevron" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="m6 8 4 4 4-4" />
        </svg>
      </button>
      <input type="hidden" id="${id}" value="${selected?.value ?? ''}">
      <div class="fixed z-[9999] rounded-2xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden hidden kryo-dropdown" style="min-width:0">
        ${items}
      </div>
    </div>
  `;
}

function positionDropdown(trigger: HTMLElement, dropdown: HTMLElement): void {
  const rect = trigger.getBoundingClientRect();
  dropdown.style.top = `${rect.bottom + 4}px`;
  dropdown.style.left = `${rect.left}px`;
  dropdown.style.width = `${rect.width}px`;
}

export function initCustomSelects(container: HTMLElement): void {
  const closeAll = (): void => {
    container.querySelectorAll<HTMLElement>('.kryo-dropdown').forEach((d) => d.classList.add('hidden'));
    container.querySelectorAll<HTMLElement>('.kryo-chevron').forEach((c) => c.classList.remove('rotate-180'));
  };

  container.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const trigger = target.closest<HTMLElement>('.kryo-trigger');
    const option = target.closest<HTMLElement>('.kryo-opt');

    if (trigger) {
      e.stopPropagation();
      const selectEl = trigger.closest<HTMLElement>('.kryo-select')!;
      const dropdown = selectEl.querySelector<HTMLElement>('.kryo-dropdown')!;
      const chevron = selectEl.querySelector<HTMLElement>('.kryo-chevron')!;
      const isOpen = !dropdown.classList.contains('hidden');

      closeAll();

      if (!isOpen) {
        positionDropdown(trigger, dropdown);
        dropdown.classList.remove('hidden');
        chevron.classList.add('rotate-180');
      }
    } else if (option) {
      const dropdown = option.closest<HTMLElement>('.kryo-dropdown')!;
      const selectEl = dropdown.closest<HTMLElement>('.kryo-select')!;
      const input = selectEl.querySelector<HTMLInputElement>('input[type="hidden"]')!;
      const label = selectEl.querySelector<HTMLElement>('.kryo-label')!;
      const chevron = selectEl.querySelector<HTMLElement>('.kryo-chevron')!;

      input.value = option.getAttribute('data-v') ?? '';
      label.textContent = option.getAttribute('data-l') ?? '';

      dropdown.querySelectorAll<HTMLElement>('.kryo-opt').forEach((o) => {
        o.className = optInactive;
        o.querySelector<HTMLElement>('.kryo-opt-dot')!.className = 'kryo-opt-dot h-1.5 w-1.5 rounded-full bg-transparent';
      });
      option.className = optActive;
      option.querySelector<HTMLElement>('.kryo-opt-dot')!.className = 'kryo-opt-dot h-1.5 w-1.5 rounded-full bg-cyan-400';

      dropdown.classList.add('hidden');
      chevron.classList.remove('rotate-180');
    } else {
      closeAll();
    }
  });

  // Close on any click outside the container
  document.addEventListener('click', closeAll);
  // Clean up when the popup is removed from DOM
  new MutationObserver((_, obs) => {
    if (!document.contains(container)) {
      document.removeEventListener('click', closeAll);
      obs.disconnect();
    }
  }).observe(document.body, { childList: true, subtree: true });
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
    confirmButton:
      'inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/12 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/18',
    cancelButton:
      'inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/8',
    closeButton: 'text-slate-500',
    validationMessage: 'mt-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100',
  },
});
