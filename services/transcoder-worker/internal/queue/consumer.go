package queue

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"streamforge/transcoder-worker/internal/config"
	"streamforge/transcoder-worker/internal/models"
	"streamforge/transcoder-worker/internal/processors"
	"streamforge/transcoder-worker/internal/storage"

	"github.com/rabbitmq/amqp091-go"
)

func connectRabbitMQ(url string) *amqp091.Connection {
	for {
		conn, err := amqp091.Dial(url)
		if err == nil {
			fmt.Println("Connected to RabbitMQ")
			return conn
		}

		fmt.Println("RabbitMQ not ready, retrying in 5 seconds:", err)
		time.Sleep(5 * time.Second)
	}
}

func StartConsumer(cfg config.Config, s3Store *storage.S3Storage) {
	fmt.Println("RabbitMQ URL from config:", cfg.RabbitMQURL)
	fmt.Println("Queue name from config:", cfg.QueueName)

	conn := connectRabbitMQ(cfg.RabbitMQURL)
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal("Channel creation failed:", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		cfg.QueueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatal("Queue declare failed:", err)
	}

	msgs, err := ch.Consume(
		q.Name,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatal("Consume failed:", err)
	}

	fmt.Println("Worker is waiting for jobs...")
maxConcurrentJobs := 2

semaphore := make(chan struct{}, maxConcurrentJobs)

for msg := range msgs {
	semaphore <- struct{}{} // take slot

	go func(msg amqp091.Delivery) {
		defer func() {
			<-semaphore // release slot
		}()

		var job models.TranscodeJob

		err := json.Unmarshal(msg.Body, &job)
		if err != nil {
			fmt.Println("Invalid job:", err)
			msg.Nack(false, false)
			return
		}

		err = processors.ProcessTranscodeJob(job, s3Store)
		if err != nil {
			fmt.Println("Job failed:", err)
			msg.Nack(false, true)
			return
		}

		msg.Ack(false)
	}(msg)
}
}