import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ── Badge ─────────────────────────────────────────────────────────────────────
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}
export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
  const variants = {
    default:     'bg-primary text-primary-foreground',
    secondary:   'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    outline:     'border border-border text-foreground',
  };
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', variants[variant], className)} {...props} />
  );
};

// ── Avatar ────────────────────────────────────────────────────────────────────
export const Avatar = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)} {...props} />
);
export const AvatarFallback = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex h-full w-full items-center justify-center rounded-full bg-secondary text-sm font-semibold', className)} {...props} />
);

// ── Switch ────────────────────────────────────────────────────────────────────
interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
}
export const Switch = ({ checked, onCheckedChange, id, disabled }: SwitchProps) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onCheckedChange?.(!checked)}
    className={cn(
      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      checked ? 'bg-primary' : 'bg-secondary'
    )}
  >
    <span className={cn('pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform', checked ? 'translate-x-5' : 'translate-x-0')} />
  </button>
);

// ── Checkbox ──────────────────────────────────────────────────────────────────
interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
}
export const Checkbox = ({ checked, onCheckedChange, id, disabled }: CheckboxProps) => (
  <button
    id={id}
    role="checkbox"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onCheckedChange?.(!checked)}
    className={cn(
      'h-4 w-4 shrink-0 rounded border border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      checked ? 'bg-primary border-primary' : 'bg-transparent'
    )}
  >
    {checked && (
      <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 m-auto">
        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </button>
);

// ── Skeleton ──────────────────────────────────────────────────────────────────
export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('animate-pulse rounded-md bg-secondary', className)} {...props} />
);

// ── Select ────────────────────────────────────────────────────────────────────
interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}
interface SelectItemProps { value: string; children: React.ReactNode; }

export const Select = ({ value, onValueChange, children, disabled }: SelectProps) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
      className="flex h-9 w-full items-center rounded-xl border border-border bg-secondary/50 px-3 py-1 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8"
    >
      {children}
    </select>
    <svg className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
  </div>
);
export const SelectTrigger = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref} className={cn('', className)} {...props} />);
SelectTrigger.displayName = 'SelectTrigger';
export const SelectValue = ({ placeholder }: { placeholder?: string }) => <span className="text-muted-foreground">{placeholder}</span>;
export const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectItem = ({ value, children }: SelectItemProps) => <option value={value}>{children as string}</option>;
