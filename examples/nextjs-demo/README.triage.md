# AI Triage Test Harness

This repo already includes a minimal Next.js sandbox under `examples/nextjs-demo/` that is wired to consume the local copy of `@blario/nextjs`.

## Run the demo

1. Install root dependencies once with `pnpm install`.
2. From the workspace root run:
   ```bash
   pnpm --filter blario-nextjs-demo dev -- --hostname 127.0.0.1 --port 4000
   ```
   (Adjust port/hostname if 3000 is unavailable.)
3. Open `http://127.0.0.1:4000/test-triage`.

> Update `examples/nextjs-demo/app/providers.tsx` to point `apiBaseUrl` at your backend, e.g. `https://blar.local/api`, and set `NEXT_PUBLIC_BLARIO_PUBLISHABLE_KEY` in `examples/nextjs-demo/.env.local`.

## What to test

### Chat transcript flow
Paste (or tweak) the JSON on the left side of the page:

```jsonc
[
  { "role": "user", "content": "The submit button on checkout isn't doing anything" },
  { "role": "assistant", "content": "Do you see any error message or console output?" },
  { "role": "user", "content": "No errors. I click submit and the form stays put." }
]
```

Hit **Open reporter with chat**. The modal should appear and network tools will show:

```
POST /api/support/triage
{
  "messages": [ ...the transcript above... ]
}
```

The response should inject `form_data.summary`, `form_data.description`, etc. into the modal and surface `suggested_meta` in the info badge.

### Manual summary flow
Fill the fields on the right panel and click **Prefill modal from summary**. The demo generates:

```jsonc
POST /api/support/triage
{
  "messages": [
    { "role": "user", "content": "<your summary>" },
    { "role": "user", "content": "<optional details>" }
  ]
}
```

You can tweak the text to simulate other triage results (e.g. severity/category hints).

### Submit to issue endpoint
After reviewing the prefill, submit the form and ensure the follow-up `POST /api/support/issue` hits your backend successfully.
