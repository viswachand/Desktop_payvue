# 🧹 Remove old configs first (safe)
find . -type f -name "tsconfig.json" -delete

# 🏗️ ROOT CONFIG
cat > tsconfig.json <<'EOF'
{
  "files": [],
  "references": [
    { "path": "./shared" },
    { "path": "./backend" },
    { "path": "./frontend" }
  ],
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "ignoreDeprecations": 6.0
  }
}
EOF

# 🧱 SHARED CONFIG
mkdir -p shared && cat > shared/tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "composite": true,
    "target": "ES2021",
    "module": "ESNext",
    "rootDir": "src",
    "outDir": "dist",
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "ignoreDeprecations": 6.0
  },
  "include": ["src/**/*"]
}
EOF

# ⚙️ BACKEND CONFIG
mkdir -p backend && cat > backend/tsconfig.json <<'EOF'
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "target": "ES2021",
    "module": "CommonJS",
    "rootDir": "src",
    "outDir": "dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "preserveSymlinks": true,
    "ignoreDeprecations": 6.0
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../shared" }
  ]
}
EOF

# 💻 FRONTEND CONFIG
mkdir -p frontend && cat > frontend/tsconfig.json <<'EOF'
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "target": "ES2022",
    "module": "ESNext",
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "ignoreDeprecations": 6.0
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../shared" }
  ]
}
EOF

echo "✅ All tsconfig.json files recreated cleanly!"
