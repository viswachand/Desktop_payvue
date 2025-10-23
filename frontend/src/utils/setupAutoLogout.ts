import { jwtDecode } from "jwt-decode";
import { store } from "@/app/store";
import { logout } from "@/features/auth/authSlice";

interface JwtPayload {
  exp: number;
}

let logoutTimer: ReturnType<typeof setTimeout> | null = null;

const isElectron = typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("electron");

export const redirectToLogin = () => {
  if (isElectron) {
    window.location.hash = "#/login";
  } else {
    window.location.replace("/login");
  }
};

export function setupAutoLogout(token: string) {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const expiryTime = decoded.exp * 1000;
    const timeout = expiryTime - Date.now();

    if (logoutTimer) clearTimeout(logoutTimer);

    if (timeout <= 0) {
      store.dispatch(logout());
      redirectToLogin();
      return;
    }

    logoutTimer = setTimeout(() => {
      store.dispatch(logout());
      redirectToLogin();
    }, timeout);
  } catch (error) {
    store.dispatch(logout());
    redirectToLogin();
  }
}

export function clearAutoLogout() {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
}
