package main

import (
	"github.com/YohansHailu/music_typing/backend/src/persistence"
	"github.com/YohansHailu/music_typing/backend/src/routes"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"io/ioutil"
)

func setupRouter(db *gorm.DB, isTesting bool) *gin.Engine {
	if isTesting {
		gin.SetMode(gin.TestMode)
		gin.SetMode(gin.ReleaseMode)
		gin.DefaultWriter = ioutil.Discard
		// disable logging
	}
	router := gin.Default()

	// Optionally disable Gin's log output in testing environment

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to music typing API",
		})
	})

	// Add your routes
	routes.AddLyricsRoutes(router, db)

	return router
}

func main() {
	println("Starting server...")
	db := persistence.InitDB()
	router := setupRouter(db, false) // Set 'true' during testing or configure via env
	println("Server started on http://localhost:8080/")
	router.Run()
}
