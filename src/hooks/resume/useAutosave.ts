import { useEffect, useRef, useState, useCallback } from 'react';
import type { ResumeData } from '@/types';

interface UseAutosaveOptions {
  data: ResumeData;
  onSave: (data: ResumeData) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export type AutosaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

export const useAutosave = ({
  data,
  onSave,
  delay = 2000,
  enabled = true,
}: UseAutosaveOptions) => {
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSaveRef = useRef(onSave);
  const baselineRef = useRef<string | null>(null);
  const baselineCaptured = useRef(false);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    if (enabled && !baselineCaptured.current) {
      baselineRef.current = JSON.stringify(data);
      baselineCaptured.current = true;
    }
  }, [enabled]);

  const serialized = JSON.stringify(data);

  useEffect(() => {
    if (!enabled || !baselineCaptured.current) return;
    if (serialized === baselineRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    
    // We update this via a micro-task/timeout to prevent React from throwing 
    // "Calling setState synchronously within an effect can trigger cascading renders"
    const pendingTimer = setTimeout(() => setAutosaveStatus('pending'), 0);

    timerRef.current = setTimeout(async () => {
      setAutosaveStatus('saving');
      try {
        await onSaveRef.current(data);
        baselineRef.current = serialized;
        setAutosaveStatus('saved');
        setTimeout(() => setAutosaveStatus('idle'), 3000);
      } catch {
        setAutosaveStatus('error');
        setTimeout(() => setAutosaveStatus('idle'), 5000);
      }
    }, delay);

    return () => {
      clearTimeout(pendingTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [serialized, delay, enabled, data]);

  const triggerSave = useCallback(async (currentData: ResumeData) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAutosaveStatus('saving');
    try {
      await onSaveRef.current(currentData);
      baselineRef.current = JSON.stringify(currentData);
      setAutosaveStatus('saved');
      setTimeout(() => setAutosaveStatus('idle'), 3000);
    } catch {
      setAutosaveStatus('error');
      setTimeout(() => setAutosaveStatus('idle'), 5000);
    }
  }, []);

  const resetBaseline = useCallback((currentData: ResumeData) => {
    baselineRef.current = JSON.stringify(currentData);
  }, []);

  return { autosaveStatus, triggerSave, resetBaseline };
};

// ── useUndoRedo ───────────────────────────────────────────────────────────────

const MAX_HISTORY = 50;

export const useUndoRedo = <T>(
  initialState: T,
  options: { maxHistory?: number } = {},
) => {
  const maxHistory = options.maxHistory ?? MAX_HISTORY;
  
  const [history, setHistory] = useState<{
    past: T[];
    present: T;
    future: T[];
  }>({
    past: [],
    present: initialState,
    future: [],
  });

  const setState = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setHistory((currentHistory) => {
        const next =
          typeof updater === 'function'
            ? (updater as (prev: T) => T)(currentHistory.present)
            : updater;
            
        if (JSON.stringify(next) === JSON.stringify(currentHistory.present)) {
          return currentHistory;
        }

        return {
          past: [...currentHistory.past.slice(-maxHistory + 1), currentHistory.present],
          present: next,
          future: [],
        };
      });
    },
    [maxHistory]
  );

  const undo = useCallback(() => {
    setHistory((currentHistory) => {
      if (currentHistory.past.length === 0) return currentHistory;
      
      const previous = currentHistory.past[currentHistory.past.length - 1]!;
      const newPast = currentHistory.past.slice(0, -1);
      
      return {
        past: newPast,
        present: previous,
        future: [currentHistory.present, ...currentHistory.future].slice(0, maxHistory),
      };
    });
  }, [maxHistory]);

  const redo = useCallback(() => {
    setHistory((currentHistory) => {
      if (currentHistory.future.length === 0) return currentHistory;
      
      const next = currentHistory.future[0]!;
      const newFuture = currentHistory.future.slice(1);
      
      return {
        past: [...currentHistory.past.slice(-maxHistory + 1), currentHistory.present],
        present: next,
        future: newFuture,
      };
    });
  }, [maxHistory]);

  const clearHistory = useCallback(() => {
    setHistory((current) => ({
      ...current,
      past: [],
      future: [],
    }));
  }, []);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    clearHistory,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
};
