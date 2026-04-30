export type Video = {
  id: string;
  title: string;
  status: 'uploaded' | 'queued' | 'processing' | 'ready' | 'failed';
  sourcePath?: string;
  createdAt: string;
};

const videos = new Map<string, Video>();

export function createVideo(title: string, sourcePath?: string) {
  const video: Video = {
    id: crypto.randomUUID(),
    title,
    status: 'uploaded',
    sourcePath,
    createdAt: new Date().toISOString()
  };

  videos.set(video.id, video);
  return video;
}

export function listVideos() {
  return Array.from(videos.values());
}

export function findVideoById(id: string) {
  return videos.get(id) ?? null;
}

export function updateVideoStatus(id: string, status: Video['status']) {
  const video = findVideoById(id);
  if (!video) {
    return null;
  }

  const updated = { ...video, status };
  videos.set(id, updated);
  return updated;
}
