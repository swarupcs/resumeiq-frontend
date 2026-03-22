import { useEffect, useRef, useState, useCallback } from 'react';

// Phase 2 — Fix 1: Autosave hook.
//
// Usage:
//   const { autosaveStatus } = useAutosave({ data, onSave, delay: 2000, enabled });
//
// autosaveStatus: 'idle' | 'pending' | 'saving' | 'saved' | 'error'
//
// How it works:
//   - Every time `data` changes, a 2-second debounce timer starts.
//   - If data changes again before the timer fires, it resets (standard debounce).
//   - When the timer fires, `onSave(data)` is called.
//   - Status reflects exactly what's happening so the UI badge is always truthful.
//
// Design decisions:
//   - `onSave` is wrapped in a ref so the effect never needs it as a dependency,
//     avoiding the "re-register debounce on every render" problem.
//   - `enabled` prop lets the parent disable autosave (e.g. while the initial
//     data is loading) so the first server→state sync doesn't trigger a save.
//   - The cleanup function cancels the timer on unmount, preventing state updates
//     on unmounted components.

export const useAutosave = ({ data, onSave, delay = 2000, enabled = true }) => {
  const [autosaveStatus, setAutosaveStatus] = useState('idle');
  const timerRef = useRef(null);
  const onSaveRef = useRef(onSave);
  const isFirstRender = useRef(true);

  // Keep onSaveRef current without re-triggering the effect
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    // Skip the very first render — we don't want to autosave the
    // initial data loaded from the server.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!enabled) return;

    // Clear any pending timer so we debounce correctly
    if (timerRef.current) clearTimeout(timerRef.current);

    // Mark as pending — user has unsaved changes
    setAutosaveStatus('pending');

    timerRef.current = setTimeout(async () => {
      setAutosaveStatus('saving');
      try {
        await onSaveRef.current(data);
        setAutosaveStatus('saved');
        // Reset to idle after 3 seconds so the badge doesn't linger forever
        setTimeout(() => setAutosaveStatus('idle'), 3000);
      } catch {
        setAutosaveStatus('error');
        // Reset to idle after 5 seconds so the user can try saving manually
        setTimeout(() => setAutosaveStatus('idle'), 5000);
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // JSON.stringify is the correct deep-comparison approach here.
  // Comparing object references would always be true (new object on every render).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data), delay, enabled]);

  // Expose a manual trigger so the Save button still works
  const triggerSave = useCallback(async (currentData) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAutosaveStatus('saving');
    try {
      await onSaveRef.current(currentData);
      setAutosaveStatus('saved');
      setTimeout(() => setAutosaveStatus('idle'), 3000);
    } catch {
      setAutosaveStatus('error');
      setTimeout(() => setAutosaveStatus('idle'), 5000);
    }
  }, []);

  return { autosaveStatus, triggerSave };
};
