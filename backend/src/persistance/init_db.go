package persistance

import (
	"github.com/YohansHailu/music_typing/backend/src/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"sync"
)

var once sync.Once
var db *gorm.DB

func InitDB() *gorm.DB {
	once.Do(func() {
    var err error
    println("Connecting to database...")
		db, err = gorm.Open(sqlite.Open("main.db"), &gorm.Config{})
		if err != nil {
			panic("failed to connect database")
		}

    println("Migrating database...")
		db.AutoMigrate(&models.LyricsDetails{})
	})
  return db
}
