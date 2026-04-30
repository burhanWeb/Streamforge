# StreamForge

StreamForge is a video upload, transcoding, and live streaming platform scaffold.

## Services

- `services/api-server`: Express API for auth, uploads, videos, and health checks.
- `services/transcoder-worker`: Go worker scaffold for consuming transcode jobs.
- `services/rtmp-server`: Node RTMP service scaffold.

## Local Setup

1. Copy `.env.example` into each service as needed.
2. Install API dependencies:

   ```sh
   cd services/api-server
   npm install
   npm run dev
   ```

3. Or run the stack with Docker:

   ```sh
   docker compose up --build
   ```
