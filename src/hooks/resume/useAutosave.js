import { useEffect, useRef, useState, useCallback } from 'react';

// Bugfix: The previous version used isFirstRender.current to skip the first
// render, but serverResume arrives asynchronously on a *later* render — so by
// the time the real data populated resumeData, isFirstRender was already false
// and the autosave treated the initial data population as a user edit.
//
// Fix: track a `baseline` — the stringified value of `data` at the moment
// autosave becomes enabled (i.e. when serverResume first loads). Any save
// attempt where the current data matches the baseline is silently skipped,
// because it means nothing has actually changed from what the server sent us.
//
// The baseline updates after every successful save, so future saves are
// correctly compared against the last saved state, not the original load.

export const useAutosave = ({ data, onSave, delay = 2000, enabled = true }) => {
  const [autosaveStatus, setAutosaveStatus] = useState('idle');
  const timerRef = useRef(null);
  const onSaveRef = useRef(onSave);

  // The stringified data at the point autosave was first enabled.
  // This represents what the server already has — no need to save it again.
  const baselineRef = useRef(null);

  // Track whether we've captured the baseline yet
  const baselineCaptured = useRef(false);

  // Keep onSaveRef current without re-triggering the effect
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Capture baseline the moment `enabled` flips to true for the first time.
  // This is the server data freshly loaded — treat it as "already saved".
  useEffect(() => {
    if (enabled && !baselineCaptured.current) {
      baselineRef.current = JSON.stringify(data);
      baselineCaptured.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const serialized = JSON.stringify(data);

  useEffect(() => {
    // Don't run until autosave is enabled (serverResume loaded)
    if (!enabled) return;

    // Don't run until we've captured the baseline
    if (!baselineCaptured.current) return;

    // Skip if data is identical to the baseline (initial server load arriving)
    // or identical to itself (no real change)
    if (serialized === baselineRef.current) return;

    // Clear any pending timer — debounce restarts on every change
    if (timerRef.current) clearTimeout(timerRef.current);

    // Mark as pending — user has unsaved changes
    setAutosaveStatus('pending');

    timerRef.current = setTimeout(async () => {
      setAutosaveStatus('saving');
      try {
        await onSaveRef.current(data);
        // Update baseline to the just-saved state
        baselineRef.current = serialized;
        setAutosaveStatus('saved');
        setTimeout(() => setAutosaveStatus('idle'), 3000);
      } catch {
        setAutosaveStatus('error');
        setTimeout(() => setAutosaveStatus('idle'), 5000);
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // serialized is the stable deep-comparison key for `data`
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized, delay, enabled]);

  // Manual trigger — cancels pending debounce and saves immediately
  const triggerSave = useCallback(async (currentData) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAutosaveStatus('saving');
    try {
      const serializedCurrent = JSON.stringify(currentData);
      await onSaveRef.current(currentData);
      baselineRef.current = serializedCurrent;
      setAutosaveStatus('saved');
      setTimeout(() => setAutosaveStatus('idle'), 3000);
    } catch {
      setAutosaveStatus('error');
      setTimeout(() => setAutosaveStatus('idle'), 5000);
    }
  }, []);

  // Call after clearHistory in ResumeBuilder (already wired) — also resets
  // the baseline so the next save compares against the freshly saved state
  const resetBaseline = useCallback((currentData) => {
    baselineRef.current = JSON.stringify(currentData);
  }, []);

  return { autosaveStatus, triggerSave, resetBaseline };
};