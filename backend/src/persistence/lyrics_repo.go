package persistence

import (
	"github.com/YohansHailu/music_typing/backend/src/models"
	"gorm.io/gorm"
)

type LyricsRepository struct {
	db *gorm.DB
}

func NewLyricsRepository(db *gorm.DB) *LyricsRepository {
	return &LyricsRepository{db: db}
}

func (repo *LyricsRepository) GetLyrics() ([]models.LyricsDetails, error) {
	var lyrics []models.LyricsDetails
	if err := repo.db.Find(&lyrics).Error; err != nil {
		return nil, err
	}
	return lyrics, nil
}

func (repo *LyricsRepository) GetLyricsById(id string) (*models.LyricsDetails, error) {
	var lyrics models.LyricsDetails
	if err := repo.db.First(&lyrics, id).Error; err != nil {
		return nil, err
	}
	return &lyrics, nil
}

func (repo *LyricsRepository) GetLyricsByTitle(title string) (*models.LyricsDetails, error) {
	var lyrics models.LyricsDetails
	if err := repo.db.Where("title = ?", title).First(&lyrics).Error; err != nil {
        // if err is not found, return nil, nil
        if err == gorm.ErrRecordNotFound {
            return nil, nil
        }


		return nil, err
	}
	return &lyrics, nil
}

func (repo *LyricsRepository) AddLyrics(lyrics models.LyricsDetails) (*models.LyricsDetails, error) {
	result := repo.db.Create(&lyrics)
	if result.Error != nil {
		return nil, result.Error
	}
	return &lyrics, nil
}
