package routes

import (
	"fmt"
	"net/http"

	"github.com/YohansHailu/music_typing/backend/src/models"
	"github.com/YohansHailu/music_typing/backend/src/persistence"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type LyricsRouter struct {
	repo *persistence.LyricsRepository
}

func NewLyricsRouter(db *gorm.DB) *LyricsRouter {
	return &LyricsRouter{
		repo: persistence.NewLyricsRepository(db),
	}
}

func (lr *LyricsRouter) GetLyrics(c *gin.Context) {
	lyrics, err := lr.repo.GetLyrics()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, lyrics)
}

func (lr *LyricsRouter) GetLyricsById(c *gin.Context) {
	id := c.Param("id")
	lyrics, err := lr.repo.GetLyricsById(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	if lyrics == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lyrics not found"})
		return
	}
	c.JSON(http.StatusOK, lyrics)
}

func (lr *LyricsRouter) GetLyricsByTitle(c *gin.Context) {
	title := c.Param("title")
	lyrics, err := lr.repo.GetLyricsByTitle(title)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if lyrics == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lyrics not found"})
		return
	}
	c.JSON(http.StatusOK, lyrics)
}

// Endpoint to add lyrics
func (lr *LyricsRouter) AddLyrics(c *gin.Context) {
	var lyrics models.LyricsDetails
	fmt.Println("Lyrics added successfully")
	if err := c.BindJSON(&lyrics); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	createdLyrics, err := lr.repo.AddLyrics(lyrics)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, createdLyrics)
}

func AddLyricsRoutes(router *gin.Engine, db *gorm.DB) {
	lyricsRouter := NewLyricsRouter(db)

	router.GET("/lyrics", lyricsRouter.GetLyrics)
	router.GET("/lyrics/:id", lyricsRouter.GetLyricsById)
	router.GET("/lyrics/title/:title", lyricsRouter.GetLyricsByTitle)
	router.POST("/lyrics", lyricsRouter.AddLyrics)
}
