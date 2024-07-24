package models

type LyricsDetails struct {
	ID     uint   `json:"id" gorm:"primaryKey"`
	Lyrics string `json:"lyrics" gorm:"type:text"`
	Title  string `json:"title" gorm:"size:255;not null;index:idx_title,unique"`
	Artist string `json:"artist" gorm:"size:100;"`
	Album  string `json:"album" gorm:"size:100;"`
}
