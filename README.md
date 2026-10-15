# Musicly

A small HTML, CSS, and JavaScript practice project: a browser-based music player with a searchable song list and basic playback controls.

This is a learning exercise focused on front-end fundamentals, not a production music service.

## Features

- Play and pause songs
- Skip forward and backward
- Shuffle and repeat playback
- Seek through a song and adjust volume
- Search songs by title
- Show or hide the song list
- Render song rows from a JavaScript array instead of repeating markup in HTML

## Run locally

Clone the repository and open `index.html` in a browser. If your browser restricts local media, serve the project folder with a local development server, such as the VS Code Live Server extension.

## Add a song

Add the audio file under `songs/` and its cover image under `covers/`. Then add an entry to the `songs` array near the top of `script.js`:

```js
{
    songName: "Song title",
    filePath: "songs/song-file.mp3",
    coverPath: "covers/song-cover.jpg"
}
```

The player builds the song list from these entries.

## Built with

- HTML
- CSS
- Vanilla JavaScript
