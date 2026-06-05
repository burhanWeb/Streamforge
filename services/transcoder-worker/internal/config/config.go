package config

import "os"

type Config struct {
	RabbitMQURL        string
	QueueName          string
	AWSRegion          string
	AWSAccessKeyID     string
	AWSSecretAccessKey string
	RawBucket          string
	TranscodedBucket   string
}

func LoadConfig() Config {
	rabbitURL := os.Getenv("RABBITMQ_URL")
	queueName := os.Getenv("QUEUE_NAME")
	
	awsRegion := os.Getenv("AWS_REGION")
	awsAccessKeyID := os.Getenv("AWS_ACCESS_KEY_ID")
	awsSecretAccessKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
	rawBucket := os.Getenv("RAW_BUCKET")         
	transcodedBucket := os.Getenv("TRANSCODED_BUCKET")

	return Config{
		RabbitMQURL:        rabbitURL,
		QueueName:          queueName,
		AWSRegion:          awsRegion,
		AWSAccessKeyID:     awsAccessKeyID,
		AWSSecretAccessKey: awsSecretAccessKey,
		RawBucket:          rawBucket,
		TranscodedBucket:   transcodedBucket,
	}
}