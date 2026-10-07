# typeofNaN

This site uses the Next.js App Router API with [Vinext](https://vinext.dev/) and Vite for faster local development and HMR. The existing Next.js toolchain remains available as a fallback and continues to produce the GitHub Pages build.

## Getting Started

Install dependencies and start the Vinext development server on port 4000:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:4000](http://localhost:4000) in your browser. Vite handles hot module replacement.

Useful commands:

```bash
pnpm dev             # Vinext + Vite development server
pnpm dev:next        # Original Next.js + Turbopack development server
pnpm build:vinext    # Verify the Vinext production/static build
pnpm build           # GitHub Pages build (Next.js static export)
```

## Deployment

The GitHub Actions workflow still runs `pnpm build` and deploys the static `out/` directory, so the Vinext migration does not change the production hosting path.
