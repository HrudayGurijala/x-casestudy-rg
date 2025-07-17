package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type EnvConfig struct {
	PORT                  string
	MONGO_URI             string
	CLERK_PUBLISHABLE_KEY string
	CLERK_SECRET_KEY      string
	CLOUDINARY_CLOUD_NAME string
	CLOUDINARY_API_KEY    string
	CLOUDINARY_API_SECRET string
}

var ENV *EnvConfig

func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on system environment variables.")
	}

	ENV = &EnvConfig{
		PORT:                  os.Getenv("PORT"),
		MONGO_URI:             os.Getenv("MONGO_URI"),
		CLERK_PUBLISHABLE_KEY: os.Getenv("CLERK_PUBLISHABLE_KEY"),
		CLERK_SECRET_KEY:      os.Getenv("CLERK_SECRET_KEY"),
		CLOUDINARY_CLOUD_NAME: os.Getenv("CLOUDINARY_CLOUD_NAME"),
		CLOUDINARY_API_KEY:    os.Getenv("CLOUDINARY_API_KEY"),
		CLOUDINARY_API_SECRET: os.Getenv("CLOUDINARY_API_SECRET"),
	}
}
