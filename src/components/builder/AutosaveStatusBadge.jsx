import { Check, Clock, Loader2, AlertCircle } from 'lucide-react';

// Phase 2 — Fix 1: Autosave status badge.
// Sits in the ResumeBuilder header next to the Save button.
// Status values: 'idle' | 'pending' | 'saving' | 'saved' | 'error'

const config = {
  idle: null, // Show nothing when idle — no noise
  pending: {
    icon: Clock,
    label: 'Unsaved changes',
    className: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  saving: {
    icon: Loader2,
    label: 'Saving…',
    className: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    spin: true,
  },
  saved: {
    icon: Check,
    label: 'Saved',
    className: 'text-green-500 bg-green-500/10 border-green-500/20',
  },
  error: {
    icon: AlertCircle,
    label: 'Save failed',
    className: 'text-destructive bg-destructive/10 border-destructive/20',
  },
};

const AutosaveStatusBadge = ({ status }) => {
  const item = config[status];
  if (!item) return null;

  const Icon = item.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all duration-300 ${item.className}`}
    >
      <Icon className={`h-3 w-3 ${item.spin ? 'animate-spin' : ''}`} />
      {item.label}
    </div>
  );
};

export default AutosaveStatusBadge;
