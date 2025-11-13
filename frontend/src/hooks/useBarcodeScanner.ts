import { useEffect, useRef } from "react";

interface BarcodeScannerOptions {
  onScan: (value: string) => void;
  enabled?: boolean;
  minLength?: number;
  debounceMs?: number;
  shouldCapture?: (event: KeyboardEvent) => boolean;
}

/**
 * A lightweight listener that treats very fast sequential key presses ending with Enter as a barcode scan.
 * Works with HID scanners that emulate a keyboard without the need for additional dependencies.
 */
export function useBarcodeScanner({
  onScan,
  enabled = true,
  minLength = 3,
  debounceMs = 120,
  shouldCapture,
}: BarcodeScannerOptions) {
  const bufferRef = useRef("");
  const resetTimerRef = useRef<number | undefined>();

  useEffect(() => {
    if (!enabled) return undefined;

    const clearBuffer = () => {
      bufferRef.current = "";
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = undefined;
      }
    };

    const scheduleBufferReset = () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => {
        bufferRef.current = "";
        resetTimerRef.current = undefined;
      }, debounceMs);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (shouldCapture && !shouldCapture(event)) {
        clearBuffer();
        return;
      }

      if (event.repeat) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "Enter") {
        if (bufferRef.current.length >= minLength) {
          onScan(bufferRef.current);
        }
        clearBuffer();
        return;
      }

      if (event.key.length === 1) {
        bufferRef.current += event.key;
        scheduleBufferReset();
        return;
      }

      // Any other key (tab, arrows, etc.) should reset the buffer.
      clearBuffer();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearBuffer();
    };
  }, [debounceMs, enabled, minLength, onScan, shouldCapture]);
}
