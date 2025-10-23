export function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (err) {
    console.error("Render error:", err);
    throw err;
  }
}
