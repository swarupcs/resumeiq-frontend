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
    setAutosaveStatus('pending');

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
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [serialized, delay, enabled]);

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
  const [state, setStateRaw] = useState<T>(initialState);
  const undoStack = useRef<T[]>([]);
  const redoStack = useRef<T[]>([]);

  const setState = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setStateRaw((current) => {
        const next =
          typeof updater === 'function'
            ? (updater as (prev: T) => T)(current)
            : updater;
        if (JSON.stringify(next) === JSON.stringify(current)) return current;
        undoStack.current = [
          ...undoStack.current.slice(-maxHistory + 1),
          current,
        ];
        redoStack.current = [];
        return next;
      });
    },
    [maxHistory],
  );

  const undo = useCallback(() => {
    if (!undoStack.current.length) return;
    setStateRaw((current) => {
      const previous = undoStack.current[undoStack.current.length - 1]!;
      undoStack.current = undoStack.current.slice(0, -1);
      redoStack.current = [current, ...redoStack.current].slice(0, maxHistory);
      return previous;
    });
  }, [maxHistory]);

  const redo = useCallback(() => {
    if (!redoStack.current.length) return;
    setStateRaw((current) => {
      const next = redoStack.current[0]!;
      redoStack.current = redoStack.current.slice(1);
      undoStack.current = [
        ...undoStack.current.slice(-maxHistory + 1),
        current,
      ];
      return next;
    });
  }, [maxHistory]);

  const clearHistory = useCallback(() => {
    undoStack.current = [];
    redoStack.current = [];
  }, []);

  return {
    state,
    setState,
    undo,
    redo,
    clearHistory,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
  };
};
