package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/YohansHailu/music_typing/backend/src/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
    "github.com/gin-gonic/gin"
    "fmt"
    "net/url"
)

func setupTestEnvironment(t *testing.T) (*gin.Engine, *gorm.DB) {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	assert.NoError(t, err, "Failed to connect to memory database")

	db.AutoMigrate(&models.LyricsDetails{}) // Migrate schemas here
    db.Exec("DELETE FROM lyrics_details")  // Clean up before each test

	router := setupRouter(db, true)
	return router, db
}

func performRequest(r http.Handler, method, path string, body string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestHealthCheckRoute(t *testing.T) {
	router, _ := setupTestEnvironment(t)

	w := performRequest(router, "GET", "/", "")
	assert.Equal(t, http.StatusOK, w.Code, "Expected status code 200")
	assert.Contains(t, w.Body.String(), "Welcome to music typing API", "Response body does not include expected text")
}

func TestGetAllLyrics(t *testing.T) {
	router, db := setupTestEnvironment(t)

	sampleLyrics := "Here are some sample lyrics"
	sampleTitle := "Sample Title"
	db.Create(&models.LyricsDetails{Lyrics: &sampleLyrics, Title: &sampleTitle, Artist: new(string), Album: new(string)})

	w := performRequest(router, "GET", "/lyrics", "")
	assert.Equal(t, http.StatusOK, w.Code, "Expected status code 200")

	var lyrics []models.LyricsDetails
	assert.NoError(t, json.Unmarshal(w.Body.Bytes(), &lyrics), "Failed to unmarshal response")
	assert.NotEmpty(t, lyrics, "Expected non-empty list of lyrics")
	assert.Equal(t, sampleLyrics, *lyrics[0].Lyrics, "Returned lyrics do not match added lyrics")
}

func TestGetLyricsById(t *testing.T) {
	router, db := setupTestEnvironment(t)

	sampleLyrics := "Unique lyrics for testing"
	sampleTitle := "Unique Title"
	sampleArtist := "Artist Name"
	sampleAlbum := "Album Name"
	lyric := &models.LyricsDetails{Lyrics: &sampleLyrics, Title: &sampleTitle, Artist: &sampleArtist, Album: &sampleAlbum}
	db.Create(lyric)

	// Testing fetching valid ID
	reqUrl := fmt.Sprintf("/lyrics/%d", *lyric.ID) // Assumes ID is set after db.Create
	w := performRequest(router, "GET", reqUrl, "")
	assert.Equal(t, http.StatusOK, w.Code, "Expected status code 200")

	// Testing fetching invalid ID
	invalidUrl := fmt.Sprintf("/lyrics/%d", *lyric.ID+1) // Non-existent ID
	w = performRequest(router, "GET", invalidUrl, "")
	assert.Equal(t, http.StatusNotFound, w.Code, "Expected status code 404 for not found")
}

func TestGetLyricsByTitle(t *testing.T) {
	router, db := setupTestEnvironment(t)

	sampleLyrics := "Lyrics with a unique title for testing"
	sampleTitle := "A Very Unique Title"
	sampleArtist := "Test Artist"
	sampleAlbum := "Test Album"
	lyric := &models.LyricsDetails{Lyrics: &sampleLyrics, Title: &sampleTitle, Artist: &sampleArtist, Album: &sampleAlbum}
	db.Create(lyric)

	// Testing fetching valid title
	reqUrl := fmt.Sprintf("/lyrics/title/%s", url.PathEscape(*lyric.Title))
	w := performRequest(router, "GET", reqUrl, "")
	assert.Equal(t, http.StatusOK, w.Code, "Expected status code 200")

	var returnedLyric models.LyricsDetails
	assert.NoError(t, json.Unmarshal(w.Body.Bytes(), &returnedLyric), "Failed to unmarshal response")
	assert.Equal(t, sampleLyrics, *returnedLyric.Lyrics, "Returned lyrics do not match stored lyrics")

	// Testing fetching invalid title
	invalidUrl := "/lyrics/title/NonExistentTitle"
	w = performRequest(router, "GET", invalidUrl, "")
	assert.Equal(t, http.StatusNotFound, w.Code, "Expected status code 404 for not found")
}

func TestAddLyrics(t *testing.T) {
	router, _ := setupTestEnvironment(t)

	newLyricJSON := `{"lyrics": "New lyrics for testing", "title": "New Title", "artist": "New Artist", "album": "New Album"}`
	w := performRequest(router, "POST", "/lyrics", newLyricJSON)
	assert.Equal(t, http.StatusCreated, w.Code, "Expected status code 201")

	var returnedLyric models.LyricsDetails
	assert.NoError(t, json.Unmarshal(w.Body.Bytes(), &returnedLyric), "Should unmarshal without error")
	assert.Equal(t, "New lyrics for testing", *returnedLyric.Lyrics, "Lyrics mismatch")

	// Check for invalid data (missing title)
	invalidLyricJSON := `{"lyrics": "Incomplete lyrics data"}`
	w = performRequest(router, "POST", "/lyrics", invalidLyricJSON)
	assert.Equal(t, http.StatusBadRequest, w.Code, "Expected status code 400 for invalid data")
}
