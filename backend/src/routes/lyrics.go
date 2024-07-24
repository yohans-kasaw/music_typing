package routes

import (
    "github.com/YohansHailu/music_typing/backend/src/persistance"
    "github.com/gin-gonic/gin"
)

type LyricsRouter struct {
    repo *persistance.LyricsRepository
}

func NewLyricsRouter() *LyricsRouter {
    return &LyricsRouter{
        repo: persistance.NewLyricsRepository(),  // Repository is instantiated within the Router
    }
}

func (lr *LyricsRouter) GetLyrics(c *gin.Context) {
    lyrics := lr.repo.GetLyrics()
    c.JSON(200, lyrics)
}

func (lr *LyricsRouter) GetLyricsById(c *gin.Context) {
    id := c.Param("id")
    lyrics := lr.repo.GetLyricsById(id)
    c.JSON(200, lyrics)
}

func (lr *LyricsRouter) GetLyricsByTitle(c *gin.Context) {
    title := c.Param("title")
    lyrics := lr.repo.GetLyricsByTitle(title)
    c.JSON(200, lyrics)
}

func AddLyricsRoutes(router *gin.Engine) {
    lyricsRouter := NewLyricsRouter()  // Instantiating the LyricsRouter

    router.GET("/lyrics", lyricsRouter.GetLyrics)
    router.GET("/lyrics/:id", lyricsRouter.GetLyricsById)
    router.GET("/lyrics/title/:title", lyricsRouter.GetLyricsByTitle)
}
