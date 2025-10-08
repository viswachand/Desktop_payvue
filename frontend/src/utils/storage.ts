const AUTH_KEY = "payvue_auth";

export const persistAuth = (token: string, user: any) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));
};

export const getStoredAuth = (): { token: string; user: any } | null => {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
};

export const clearAuth = () => {
    localStorage.removeItem(AUTH_KEY);
};
