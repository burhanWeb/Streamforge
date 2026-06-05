package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"

	appconfig "streamforge/transcoder-worker/internal/config"
)

type S3Storage struct {
	client           *s3.Client
	rawBucket        string
	transcodedBucket string
}

func NewS3Storage(cfg appconfig.Config) (*S3Storage, error) {
	// Use credentials from config
	awsCfg, err := config.LoadDefaultConfig(
		context.TODO(),
		config.WithRegion(cfg.AWSRegion),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			cfg.AWSAccessKeyID,
			cfg.AWSSecretAccessKey,
			"",
		)),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to load AWS config: %w", err)
	}

	client := s3.NewFromConfig(awsCfg)

	return &S3Storage{
		client:           client,
		rawBucket:        cfg.RawBucket,
		transcodedBucket: cfg.TranscodedBucket,
	}, nil
}

func (s *S3Storage) DownloadFile(key string, localPath string) error {
	result, err := s.client.GetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: &s.rawBucket,
		Key:    &key,
	})
	if err != nil {
		return err
	}
	defer result.Body.Close()

	// Create directory if it doesn't exist
	if err := os.MkdirAll(filepath.Dir(localPath), 0755); err != nil {
		return err
	}

	file, err := os.Create(localPath)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = io.Copy(file, result.Body)
	return err
}

func (s *S3Storage) UploadFile(localPath string, key string, contentType string) error {
	file, err := os.Open(localPath)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = s.client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:      &s.transcodedBucket,
		Key:         &key,
		Body:        file,
		ContentType: &contentType,
	})

	return err
}

func (s *S3Storage) UploadFolder(localDir string, s3Prefix string) error {
	return filepath.Walk(localDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		relativePath, err := filepath.Rel(localDir, path)
		if err != nil {
			return err
		}

		key := filepath.ToSlash(filepath.Join(s3Prefix, relativePath))

		contentType := "application/octet-stream"

		if filepath.Ext(path) == ".m3u8" {
			contentType = "application/vnd.apple.mpegurl"
		}

		if filepath.Ext(path) == ".ts" {
			contentType = "video/mp2t"
		}

		fmt.Println("Uploading:", key)

		return s.UploadFile(path, key, contentType)
	})
}