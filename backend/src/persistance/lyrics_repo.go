package persistance
import (
  "github.com/YohansHailu/music_typing/backend/src/models"
  "gorm.io/gorm"
)


type LyricsRepository struct {
    db *gorm.DB
}

func NewLyricsRepository() *LyricsRepository {
    return &LyricsRepository{
        db: InitDB(),
    }
}

func (repo *LyricsRepository) GetLyrics() []models.LyricsDetails {
    var lyrics []models.LyricsDetails
    repo.db.Find(&lyrics)
    return lyrics
}

func (repo *LyricsRepository) GetLyricsById(id string) models.LyricsDetails {
    var lyrics models.LyricsDetails
    repo.db.First(&lyrics, id)
    return lyrics
}

func (repo *LyricsRepository) GetLyricsByTitle(title string) models.LyricsDetails {
    var lyrics models.LyricsDetails
    repo.db.Where("title = ?", title).First(&lyrics)
    return lyrics
}

