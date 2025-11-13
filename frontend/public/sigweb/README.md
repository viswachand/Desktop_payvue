### SigWebTablet.js

Place Topaz's official `SigWebTablet.js` in this folder so both the Vite dev server and the packaged Electron build can load the script locally (e.g., `/sigweb/SigWebTablet.js`).

You can copy it from a machine where SigWeb is installed:

```
C:\Program Files (x86)\Topaz Systems\SigWeb\SigWebTablet.js
```

The application will try this bundled copy first and only fall back to the public CDN if it is missing.
