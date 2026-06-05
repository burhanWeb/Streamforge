package main

import (
	"log"
	"streamforge/transcoder-worker/internal/config"
	"streamforge/transcoder-worker/internal/queue"
	"streamforge/transcoder-worker/internal/storage"
)

func main() {
	cfg := config.LoadConfig()

	log.Printf("Config loaded:")
	log.Printf("  AWS Region: %s", cfg.AWSRegion)
	log.Printf("  Raw Bucket: %s", cfg.RawBucket)
	log.Printf("  Transcoded Bucket: %s", cfg.TranscodedBucket)
	log.Printf("  RabbitMQ URL: %s", cfg.RabbitMQURL)
	log.Printf("  Queue Name: %s", cfg.QueueName)

	s3Store, err := storage.NewS3Storage(cfg)
	if err != nil {
		log.Fatal("S3 init failed:", err)
	}

	queue.StartConsumer(cfg, s3Store)
}
