/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // Add more VITE_ vars as you create them
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
