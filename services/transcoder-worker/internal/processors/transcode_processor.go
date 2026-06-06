package processors

import (
	"fmt"
	"os"
	"path/filepath"
	"streamforge/transcoder-worker/internal/ffmpeg"
	"streamforge/transcoder-worker/internal/models"
	"streamforge/transcoder-worker/internal/storage"
)

func ProcessTranscodeJob(job models.TranscodeJob, s3Store *storage.S3Storage) error {
	fmt.Println("START job:", job.VideoID)

	workDir := filepath.Join("tmp", job.VideoID)
	inputPath := filepath.Join(workDir, "input.mp4")
	outputDir := filepath.Join(workDir, "hls")

	err := os.MkdirAll(workDir, os.ModePerm)
	if err != nil {
		return err
	}

	fmt.Println("Downloading:", job.VideoID)

	err = s3Store.DownloadFile(job.RawS3Key, inputPath)
	if err != nil {
		return err
	}

	fmt.Println("Downloaded raw video:", inputPath)

	fmt.Println("Transcoding:", job.VideoID)

	err = ffmpeg.TranscodeToHLS(inputPath, outputDir)
	if err != nil {
		return err
	}

	fmt.Println("Transcoded:", job.VideoID)

	outputPrefix := filepath.ToSlash(filepath.Join("videos", job.VideoID, "hls"))

	fmt.Println("Uploading:", job.VideoID)

	err = s3Store.UploadFolder(outputDir, outputPrefix)
	if err != nil {
		return err
	}

	fmt.Println("Uploaded HLS output:", outputPrefix)

	fmt.Println("END job:", job.VideoID)

	return nil
}
