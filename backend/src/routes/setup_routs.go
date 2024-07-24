package routes
import (
  "github.com/gin-gonic/gin"
)

func setupRoutes() {
  router := gin.Default()
  AddLyricsRoutes(router)
  router.Run(":8080")
}
