package ffmpeg

import (
	"os"
	"os/exec"
	"path/filepath"
)

func TranscodeToHLS(inputPath string, outputDir string) error {
	err := os.MkdirAll(outputDir, os.ModePerm)
	if err != nil {
		return err
	}

	cmd := exec.Command(
		"ffmpeg",
		"-i", inputPath,

		"-filter_complex",
		"[0:v]split=3[v1][v2][v3];"+
			"[v1]scale=w=640:h=360[v360];"+
			"[v2]scale=w=1280:h=720[v720];"+
			"[v3]scale=w=1920:h=1080[v1080]",

		"-map", "[v360]",
		"-map", "0:a",
		"-c:v:0", "libx264",
		"-b:v:0", "800k",
		"-c:a:0", "aac",
		"-b:a:0", "96k",

		"-map", "[v720]",
		"-map", "0:a",
		"-c:v:1", "libx264",
		"-b:v:1", "2500k",
		"-c:a:1", "aac",
		"-b:a:1", "128k",

		"-map", "[v1080]",
		"-map", "0:a",
		"-c:v:2", "libx264",
		"-b:v:2", "5000k",
		"-c:a:2", "aac",
		"-b:a:2", "192k",

		"-f", "hls",
		"-hls_time", "10",
		"-hls_playlist_type", "vod",
		"-hls_segment_filename", filepath.Join(outputDir, "v%v", "segment_%03d.ts"),
		"-master_pl_name", "master.m3u8",
		"-var_stream_map", "v:0,a:0,name:360p v:1,a:1,name:720p v:2,a:2,name:1080p",
		filepath.Join(outputDir, "v%v", "index.m3u8"),
	)

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	return cmd.Run()
}