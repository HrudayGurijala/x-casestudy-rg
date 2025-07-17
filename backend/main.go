package main

import (
	"log"
	"x-casestudy/config"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.New()
	router.Use(gin.Logger())

	port := config.ENV.PORT
	if port == "" {
		port = "42069"
	}
	router.GET("/", func(c *gin.Context) {
		c.String(200, "testing")
	})

	log.Printf("Starting server on http://localhost:%s\n\n", port)
	log.Fatal(router.Run(":" + port))
}
