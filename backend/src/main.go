package main

import (
	"github.com/YohansHailu/music_typing/backend/src/routes"
  "github.com/gin-gonic/gin"
)

func main() {
  println("Starting server...")
  router := gin.Default()
  // add health check route

  router.GET("/", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "wellcome to music typing api",
    })
  })


  routes.AddLyricsRoutes(router)
  println("Server started on http://localhost:8080/")
  router.Run()
}
