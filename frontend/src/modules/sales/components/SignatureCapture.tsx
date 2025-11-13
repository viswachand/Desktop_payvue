import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  useTheme,
} from "@/components/common";
import type { SaleSignature } from "@payvue/shared/types/sale";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
const SIGWEB_REMOTE_FALLBACK =
  import.meta.env.VITE_SIGWEB_REMOTE_URL?.trim() || "";
const CANVAS_WIDTH = 520;
const CANVAS_HEIGHT = 170;
const loadedSigWebScripts = new Set<string>();

type CaptureMode = "topaz" | "manual";

type SigWebApi = Window & {
  SetTabletState?: (state: number, target?: any, interval?: number) => void;
  ClearTablet?: () => void;
  NumberOfTabletPoints?: () => number;
  GetSigString?: () => string;
  GetSigImageB64?: (...args: any[]) => any;
  IsSigWebInstalled?: () => boolean;
  SetImageXSize?: (value: number) => void;
  SetImageYSize?: (value: number) => void;
  SetImagePenWidth?: (value: number) => void;
  SetJustifyMode?: (value: number) => void;
};

interface SignatureCaptureProps {
  value: SaleSignature | null;
  onChange: (signature: SaleSignature | null) => void;
}

const isWindowsPlatform = () => {
  if (typeof navigator === "undefined") return false;
  return /windows/i.test(navigator.userAgent ?? "");
};

const getSigWebApi = (): SigWebApi | null => {
  if (typeof window === "undefined") return null;
  const candidate = window as SigWebApi;
  if (
    typeof candidate.SetTabletState !== "function" ||
    typeof candidate.GetSigString !== "function"
  ) {
    return null;
  }
  return candidate;
};

const normalizeBasePath = (base: string) => {
  if (!base || base === "./") return "/";
  if (base.startsWith("/")) return base;
  return `/${base}`;
};

const getSigWebScriptCandidates = (): string[] => {
  if (typeof window === "undefined") return [];

  const urls = new Set<string>();
  const { href, origin, protocol } = window.location;

  try {
    urls.add(new URL("./sigweb/SigWebTablet.js", href).toString());
  } catch {
    // ignore
  }

  if (origin && origin !== "null" && protocol.startsWith("http")) {
    const base = normalizeBasePath(BASE_URL);
    const cleanedBase = base.endsWith("/")
      ? base.slice(0, -1)
      : base || "/";
    urls.add(
      `${origin.replace(/\/$/, "")}${cleanedBase}/sigweb/SigWebTablet.js`
    );
  }

  urls.add("sigweb/SigWebTablet.js");

  if (SIGWEB_REMOTE_FALLBACK) {
    urls.add(SIGWEB_REMOTE_FALLBACK);
  }

  return Array.from(urls);
};

const injectSigWebScript = (src: string): Promise<void> => {
  if (!src) return Promise.reject(new Error("Invalid SigWeb script path"));
  if (loadedSigWebScripts.has(src)) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = Array.from(
      document.querySelectorAll<HTMLScriptElement>("script[data-sigweb-script]")
    ).find((node) => node.src === src);

    if (existing && existing.dataset.loaded === "true") {
      loadedSigWebScripts.add(src);
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.sigwebScript = src;
    script.onload = () => {
      loadedSigWebScripts.add(src);
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () =>
      reject(new Error(`Failed to load SigWeb script from ${src}`));

    document.body.appendChild(script);
  });
};

const normalizeImageData = (raw: string | undefined, format = "image/png") => {
  if (!raw) return "";
  return raw.startsWith("data:") ? raw : `data:${format};base64,${raw}`;
};

const configureSigWebImage = (api: SigWebApi) => {
  api.SetImageXSize?.(CANVAS_WIDTH);
  api.SetImageYSize?.(CANVAS_HEIGHT);
  api.SetImagePenWidth?.(2);
  api.SetJustifyMode?.(5);
};

const readSigWebImage = (api: SigWebApi): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fn = api.GetSigImageB64;
    if (typeof fn !== "function") {
      reject(new Error("SigWeb helper missing GetSigImageB64"));
      return;
    }

    const callback = (result: string, status?: number) => {
      if (result) {
        resolve(result);
      } else {
        reject(
          status === 400
            ? new Error(
                "SigWeb could not render the signature. Please ensure the pad is still connected."
              )
            : new Error("Empty signature image received")
        );
      }
    };

    configureSigWebImage(api);

    try {
      if (fn.length <= 1) {
        const maybeResult = fn.call(api, callback);
        if (typeof maybeResult === "string" && maybeResult) {
          resolve(maybeResult);
        }
      } else {
        fn.call(
          api,
          callback,
          "image/png",
          "#FFFFFF",
          "#000000",
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          50
        );
      }
    } catch (error: any) {
      reject(
        error instanceof Error
          ? error
          : new Error("Unable to read signature image")
      );
    }
  });
};

export default function SignatureCapture({
  value,
  onChange,
}: SignatureCaptureProps) {
  const theme = useTheme();
  const [mode, setMode] = useState<CaptureMode>(() =>
    isWindowsPlatform() ? "topaz" : "manual"
  );
  const [sigWebReady, setSigWebReady] = useState(() => !!getSigWebApi());
  const [sigWebError, setSigWebError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [manualHasInk, setManualHasInk] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isWindows = useMemo(() => isWindowsPlatform(), []);

  const sigWebAvailable = sigWebReady && !!getSigWebApi();

  useEffect(() => {
    if (!isWindows || sigWebReady) return;
    let cancelled = false;

    const existingApi = getSigWebApi();
    if (existingApi) {
      setSigWebReady(true);
      setSigWebError(null);
      return;
    }

    const candidates = getSigWebScriptCandidates();

    const loadSequentially = async () => {
      for (const url of candidates) {
        try {
          await injectSigWebScript(url);
          if (cancelled) return;
          const api = getSigWebApi();
          if (api) {
            const installed = api.IsSigWebInstalled?.();
            if (installed === false) {
              setSigWebError(
                "SigWeb helper loaded but the background service is not running."
              );
              continue;
            }
            setSigWebReady(true);
            setSigWebError(null);
            return;
          }
        } catch (error: any) {
          console.warn(error?.message || error);
        }
      }
      if (!cancelled) {
        setSigWebError(
          "Unable to load SigWebTablet.js. Place the file in /sigweb/SigWebTablet.js or reinstall SigWeb."
        );
        setMode("manual");
      }
    };

    loadSequentially();

    return () => {
      cancelled = true;
    };
  }, [isWindows, sigWebReady]);

  useEffect(() => {
    if (mode === "manual") {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (canvas && ctx) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
      const api = getSigWebApi();
      api?.SetTabletState?.(0);
      setIsCapturing(false);
    }
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode !== "manual") return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.width = "100%";
    canvas.style.maxWidth = `${CANVAS_WIDTH}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;
    canvas.style.display = "block";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = theme.palette.text.primary ?? "#111111";
    ctxRef.current = ctx;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    setManualHasInk(false);
  }, [mode, theme]);

  useEffect(() => {
    return () => {
      const api = getSigWebApi();
      api?.SetTabletState?.(0);
    };
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (mode !== "manual") return;
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
      const y = ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
      ctx.beginPath();
      ctx.moveTo(x, y);
      canvas.setPointerCapture?.(event.pointerId);
      setIsDrawing(true);
      setManualHasInk(true);
      setManualError(null);
    },
    [mode]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (mode !== "manual" || !isDrawing) return;
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
      const y = ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
      ctx.lineTo(x, y);
      ctx.stroke();
    },
    [isDrawing, mode]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (mode !== "manual" || !isDrawing) return;
      event.preventDefault();
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      ctx?.closePath();
      canvas?.releasePointerCapture?.(event.pointerId);
      setIsDrawing(false);
    },
    [isDrawing, mode]
  );

  const handlePointerLeave = useCallback(() => {
    if (mode !== "manual" || !isDrawing) return;
    ctxRef.current?.closePath();
    setIsDrawing(false);
  }, [isDrawing, mode]);

  const clearManualCanvas = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    setManualHasInk(false);
    setManualError(null);
    onChange(null);
  }, [onChange]);

  const saveManualSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!manualHasInk) {
      setManualError("Please draw a signature before using it.");
      return;
    }
    const dataUrl = canvas.toDataURL("image/png");
    onChange({
      imageData: dataUrl,
      format: "image/png",
      padType: "manual-canvas",
      capturedAt: new Date().toISOString(),
    });
    setManualError(null);
  }, [manualHasInk, onChange]);

  const startTopazCapture = useCallback(() => {
    const api = getSigWebApi();
    if (!api) {
      setSigWebError(
        "Topaz SigWeb helper is not available. Switch to manual mode."
      );
      setMode("manual");
      return;
    }
    api.ClearTablet?.();
    api.SetTabletState?.(0);
    api.SetTabletState?.(1, null, 50);
    setIsCapturing(true);
    setSigWebError(null);
  }, []);

  const clearTopazPad = useCallback(() => {
    const api = getSigWebApi();
    api?.ClearTablet?.();
    setSigWebError(null);
  }, []);

  const useTopazSignature = useCallback(async () => {
    const api = getSigWebApi();
    if (!api) {
      setSigWebError(
        "Unable to communicate with the Topaz device. Switch to manual mode."
      );
      setMode("manual");
      return;
    }
    if (
      typeof api.NumberOfTabletPoints === "function" &&
      api.NumberOfTabletPoints() === 0
    ) {
      setSigWebError("No signature detected on the pad yet.");
      return;
    }
    try {
      if (typeof api.NumberOfTabletPoints === "function") {
        const points = api.NumberOfTabletPoints();
        if (!points || points === 0) {
          setSigWebError("No signature detected on the pad yet.");
          return;
        }
      }

      const rawImage = await readSigWebImage(api);
      const rawData = api.GetSigString?.();
      const normalized = normalizeImageData(rawImage);
      onChange({
        imageData: normalized,
        format: "image/png",
        padType: "topaz-sigweb",
        capturedAt: new Date().toISOString(),
        rawData: rawData ?? undefined,
      });
      setSigWebError(null);
      setIsCapturing(false);
    } catch (error: any) {
      setSigWebError(
        error?.message ?? "Unable to read signature from the Topaz pad."
      );
    } finally {
      api.SetTabletState?.(0);
      api.ClearTablet?.();
    }
  }, [onChange]);

  const stopTopazCapture = useCallback(() => {
    const api = getSigWebApi();
    api?.SetTabletState?.(0);
    setIsCapturing(false);
  }, []);

  const handleReplaceSignature = useCallback(() => {
    onChange(null);
    setManualHasInk(false);
    setManualError(null);
    if (sigWebAvailable) {
      setMode("topaz");
    } else {
      setMode("manual");
    }
  }, [onChange, sigWebAvailable]);

  return (
    <Box
      sx={{
        border: `1px dashed ${
          theme.palette.divider ?? "rgba(0,0,0,0.12)"
        }`,
        borderRadius: 2,
        p: 2,
        mb: 2,
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        backgroundColor:
          theme.palette.mode === "light"
            ? "background.paper"
            : "rgba(255,255,255,0.02)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight={600}>
          Customer Signature
        </Typography>
        <Stack direction="row" spacing={1}>
          {!value && sigWebAvailable && mode === "manual" && (
            <Button size="small" variant="text" onClick={() => setMode("topaz")}>
              Use Topaz Pad
            </Button>
          )}
          {!value && mode === "topaz" && (
            <Button
              size="small"
              variant="text"
              onClick={() => {
                stopTopazCapture();
                setMode("manual");
              }}
            >
              Use Canvas
            </Button>
          )}
          {value && (
            <Button
              size="small"
              variant="text"
              color="secondary"
              onClick={handleReplaceSignature}
            >
              Replace Signature
            </Button>
          )}
        </Stack>
      </Stack>

      <Box
        sx={{
          mt: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          backgroundColor: "#fff",
          width: "100%",
          maxWidth: CANVAS_WIDTH,
          minHeight: CANVAS_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {mode === "manual" ? (
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: CANVAS_HEIGHT,
              touchAction: "none",
              cursor: "crosshair",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
          />
        ) : value ? (
          <Box
            component="img"
            src={normalizeImageData(value.imageData, value.format)}
            alt="Signature preview"
            sx={{ width: "100%", height: CANVAS_HEIGHT, objectFit: "contain" }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: CANVAS_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              color: sigWebError ? theme.palette.error.main : theme.palette.text.secondary,
            }}
          >
            {sigWebError
              ? sigWebError
              : isCapturing
              ? "Capturing from pad…"
              : "Tap Start Capture to begin."}
          </Box>
        )}
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        mt={2}
        flexWrap={{ xs: "wrap", sm: "nowrap" }}
      >
        {mode === "topaz" ? (
          <>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={startTopazCapture}
              disabled={isCapturing}
              sx={{ px: 2, py: 0.5 }}
            >
              Start
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={clearTopazPad}
              sx={{ px: 2, py: 0.5 }}
            >
              Clear
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={useTopazSignature}
              sx={{ px: 2, py: 0.5 }}
            >
              Use Signature
            </Button>
            {isCapturing && (
              <Button size="small" variant="text" onClick={stopTopazCapture}>
                Stop
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              size="small"
              variant="outlined"
              onClick={clearManualCanvas}
              sx={{ px: 2, py: 0.5 }}
            >
              Clear
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={saveManualSignature}
              sx={{ px: 2, py: 0.5 }}
            >
              Use Signature
            </Button>
            {sigWebAvailable && (
              <Button size="small" variant="text" onClick={() => setMode("topaz")}>
                Switch to Pad
              </Button>
            )}
          </>
        )}
      </Stack>

      {manualError && mode === "manual" && (
        <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
          {manualError}
        </Typography>
      )}

    </Box>
  );
}
