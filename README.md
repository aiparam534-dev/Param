# Param AI Pocket — iPad-only local AI experiment

A Vite web app that attempts real local text generation with Transformers.js WebAssembly and the ONNX Community SmolLM2-135M-Instruct model. No inference API or server-side model execution.

## iPad setup
1. Create a GitHub repository, upload the ZIP contents (not the ZIP itself), then open it in GitHub Codespaces in Safari.
2. Run `npm install` and `npm run dev` in the Codespaces terminal.
3. Open the forwarded HTTPS port 4173 in iPad Safari. Click **Load AI**. The first model download requires internet.
4. Ask a question. Responses run in the browser worker, not Codespaces.
5. For production run `npm run build` and deploy `dist/` to HTTPS static hosting. Install via Safari Share > Add to Home Screen.

## Important limitations
- iPad 9th gen has 3 GB RAM. Even 135M inference may crash, stall, or fail on Safari. This is an experimental starter, not verified on physical iPad hardware.
- Safari may evict browser model caches; offline inference requires all model and WASM files to have been cached, and the PWA shell to be installed. This starter does **not** verify complete offline readiness or guarantee persistent caching.
- Codespaces is online development infrastructure; inference itself runs locally in the browser.
- Model ID and quantization availability may change. If the model does not load, inspect the Hugging Face ONNX repository and Transformers.js runtime errors.
- This starter stores no chats persistently and has no model deletion UI.
