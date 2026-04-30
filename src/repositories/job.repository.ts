export type TranscodeJob = {
  id: string;
  videoId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  createdAt: string;
};

const jobs = new Map<string, TranscodeJob>();

export function createJob(videoId: string) {
  const job: TranscodeJob = {
    id: crypto.randomUUID(),
    videoId,
    status: 'queued',
    createdAt: new Date().toISOString()
  };

  jobs.set(job.id, job);
  return job;
}

export function listJobs() {
  return Array.from(jobs.values());
}
