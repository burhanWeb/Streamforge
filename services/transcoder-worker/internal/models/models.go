package models

type TranscodeJob struct {
	VideoID  string `json:"videoId"`
	RawS3Key string `json:"rawS3Key"`
}