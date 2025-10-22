import { jwtDecode } from "jwt-decode";
import { store } from "@/app/store";
import { logout } from "@/features/auth/authSlice";

interface JwtPayload {
  exp: number;
}

let logoutTimer: NodeJS.Timeout | null = null;

export function setupAutoLogout(token: string) {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const expiryTime = decoded.exp * 1000; 
    const timeout = expiryTime - Date.now();

    if (logoutTimer) clearTimeout(logoutTimer);

    if (timeout > 0) {
      logoutTimer = setTimeout(() => {
        store.dispatch(logout());
        window.location.href = "/login";
      }, timeout);
      console.log(`⏳ Auto-logout scheduled in ${timeout / 1000}s`);
    }
  } catch (error) {
    console.error("Failed to decode token for auto logout", error);
  }
}

export function clearAutoLogout() {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
}
