import { useState, useCallback, useRef } from 'react';

// Phase 3 — Feature 4: Undo / redo.
//
// Wraps the localOverrides state layer in a history stack.
// The builder calls setResumeData(updater) — this hook intercepts every
// change, saves the previous state to the undo stack, and clears the
// redo stack (branching history: any new change discards the redo future).
//
// Usage:
//   const {
//     state,           // current resume data (replaces localOverrides)
//     setState,        // replaces setResumeData — push to history + update state
//     undo,            // go back one step
//     redo,            // go forward one step
//     canUndo,         // boolean
//     canRedo,         // boolean
//     clearHistory,    // call after a server save so history doesn't grow forever
//   } = useUndoRedo(initialState, { maxHistory: 50 });
//
// Design notes:
//   - History is capped at maxHistory entries (default 50) to avoid unbounded
//     memory growth for long editing sessions.
//   - setState accepts both a new value AND a functional updater (same API as
//     React's useState) so the builder's existing setResumeData calls work
//     without modification.
//   - The undo/redo stacks are refs, not state, so they never cause re-renders
//     by themselves. Only `state` is state — the component re-renders when the
//     actual data changes, not when the history stacks change.

const MAX_HISTORY = 50;

export const useUndoRedo = (initialState, options = {}) => {
  const maxHistory = options.maxHistory ?? MAX_HISTORY;

  const [state, setStateRaw] = useState(initialState);
  const undoStack = useRef([]);  // array of past states (oldest at index 0)
  const redoStack = useRef([]);  // array of future states (most recent at index 0)

  // Push current → undo, clear redo, apply next state
  const setState = useCallback((updater) => {
    setStateRaw((current) => {
      const next =
        typeof updater === 'function' ? updater(current) : updater;

      // Don't push if nothing actually changed (e.g. initial load)
      if (JSON.stringify(next) === JSON.stringify(current)) return current;

      // Save current to undo stack
      undoStack.current = [
        ...undoStack.current.slice(-maxHistory + 1),
        current,
      ];

      // Any new edit clears the redo future
      redoStack.current = [];

      return next;
    });
  }, [maxHistory]);

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return;

    setStateRaw((current) => {
      const previous = undoStack.current[undoStack.current.length - 1];
      undoStack.current = undoStack.current.slice(0, -1);
      redoStack.current = [current, ...redoStack.current].slice(0, maxHistory);
      return previous;
    });
  }, [maxHistory]);

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return;

    setStateRaw((current) => {
      const next = redoStack.current[0];
      redoStack.current = redoStack.current.slice(1);
      undoStack.current = [
        ...undoStack.current.slice(-maxHistory + 1),
        current,
      ];
      return next;
    });
  }, [maxHistory]);

  // Call after a successful server save so the undo stack doesn't grow
  // indefinitely across a long session.
  const clearHistory = useCallback(() => {
    undoStack.current = [];
    redoStack.current = [];
  }, []);

  return {
    state,
    setState,
    undo,
    redo,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
    clearHistory,
    undoCount: undoStack.current.length,
    redoCount: redoStack.current.length,
  };
};
