const songs = [
    {
        songName: "Pokemon - Hindi",
        filePath: "songs/pokemon.mp3",
        coverPath: "covers/pokemon.jpg"
    },
    {
        songName: "Challa",
        filePath: "songs/challa.mp3",
        coverPath: "covers/challa.jpg"
    },
    {
        songName: "Dil Dhadakne Do",
        filePath: "songs/dil-dhadakne-do.mp3",
        coverPath: "covers/dil-dhadak.jpg"
    },
    {
        songName: "Dil Diyaan Gallan",
        filePath: "songs/dil-diyan-gallan.mp3",
        coverPath: "covers/dil-diyaan-gallan.jpg"
    },
    {
        songName: "Har Kisi Ko",
        filePath: "songs/har-kisi-ko.mp3",
        coverPath: "covers/harkisi.jpg"
    },
    {
        songName: "Kaabil Hoon",
        filePath: "songs/kaabil-hoon-kya.mp3",
        coverPath: "covers/kaabil.jpg"
    },
    {
        songName: "Kar Gayi Chull",
        filePath: "songs/kar-gayi-chull.mp3",
        coverPath: "covers/kargayi.jpg"
    },
    {
        songName: "Kya Mujhe Pyaar Hai",
        filePath: "songs/kya-muje-pyaar-hai.mp3",
        coverPath: "covers/kyamuje.jpg"
    },
    {
        songName: "Mexico",
        filePath: "songs/mexico.mp3",
        coverPath: "covers/mexico.jpg"
    }
];

let songIndex = 0;
const audioElement = new Audio(songs[songIndex].filePath);

const masterPlay = document.getElementById("masterPlay");
const progressBar = document.getElementById("progressBar");
const backward = document.getElementById("backward");
const forward = document.getElementById("forward");
const masterName = document.getElementById("masterName");
const masterCover = document.getElementById("masterCover");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const playerStatus = document.getElementById("playerStatus");
const volumeBar = document.getElementById("volumeBar");
const muteButton = document.getElementById("muteButton");
const shuffle = document.getElementById("shuffle");
const repeat = document.getElementById("repeat");
const songListToggle = document.getElementById("songListToggle");
const songItemContainer = document.getElementById("songItemContainer");
const songsContainer = document.getElementById("songsContainer");
const songSearch = document.getElementById("songSearch");
const songTemplate = document.getElementById("songItemTemplate");

const playButtons = [];
const songItems = [];
const timestamps = [];

const formatTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const secondsPart = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${secondsPart}`;
};

const renderSongs = () => {
    songs.forEach((song, index) => {
        const songElement = songTemplate.content.firstElementChild.cloneNode(true);
        const cover = songElement.querySelector(".cover");
        const name = songElement.querySelector(".songname");
        const playButton = songElement.querySelector(".playbtn");
        const timestamp = songElement.querySelector(".timestamp");

        cover.src = song.coverPath;
        cover.alt = `${song.songName} cover`;
        name.textContent = song.songName;
        songElement.dataset.index = index;

        songsContainer.append(songElement);
        songItems.push(songElement);
        playButtons.push(playButton);
        timestamps.push(timestamp);

        const durationAudio = new Audio(song.filePath);
        durationAudio.addEventListener("loadedmetadata", () => {
            timestamp.textContent = formatTime(durationAudio.duration);
        }, { once: true });
    });
};

const makeAllPlays = () => {
    playButtons.forEach((button) => {
        button.src = "assets/play-button.png";
        button.alt = "Play";
    });
};

const makeAllInactive = () => {
    songItems.forEach((item) => item.classList.remove("active"));
};

const disableRepeat = () => repeat.classList.remove("active");
const disableShuffle = () => shuffle.classList.remove("active");

const playSong = (manualChange = true) => {
    if (manualChange) {
        disableRepeat();
    }

    makeAllPlays();
    makeAllInactive();

    playButtons[songIndex].src = "assets/pause.png";
    playButtons[songIndex].alt = "Pause";
    songItems[songIndex].classList.add("active");
    masterName.textContent = songs[songIndex].songName;
    masterCover.src = songs[songIndex].coverPath;
    playerStatus.textContent = "Playing now";
    audioElement.src = songs[songIndex].filePath;
    audioElement.currentTime = 0;
    progressBar.value = 0;
    currentTime.textContent = "0:00";
    totalTime.textContent = "0:00";

    audioElement.play().catch(() => {
        makeAllPlays();
        masterPlay.querySelector("img").src = "assets/play-button.png";
        masterPlay.title = "Play";
        playerStatus.textContent = "Unable to play this song";
    });
    masterPlay.querySelector("img").src = "assets/pause.png";
    masterPlay.title = "Pause";
};

const resumeSong = () => {
    audioElement.play().then(() => {
        masterPlay.querySelector("img").src = "assets/pause.png";
        masterPlay.title = "Pause";
        playButtons[songIndex].src = "assets/pause.png";
        playButtons[songIndex].alt = "Pause";
        playerStatus.textContent = "Playing now";
    }).catch(() => {
        makeAllPlays();
        masterPlay.querySelector("img").src = "assets/play-button.png";
        masterPlay.title = "Play";
        playerStatus.textContent = "Unable to play this song";
    });
};

const pauseSong = () => {
    audioElement.pause();
    masterPlay.querySelector("img").src = "assets/play-button.png";
    masterPlay.title = "Play";
    playButtons[songIndex].src = "assets/play-button.png";
    playButtons[songIndex].alt = "Play";
    playerStatus.textContent = "Paused";
};

const selectSong = (index) => {
    if (songIndex === index) {
        if (audioElement.paused) {
            resumeSong();
        }
        else {
            pauseSong();
        }
        return;
    }

    songIndex = index;
    playSong();
};

renderSongs();

songListToggle.addEventListener("click", () => {
    const isExpanded = songListToggle.getAttribute("aria-expanded") === "true";

    songItemContainer.hidden = isExpanded;
    songListToggle.setAttribute("aria-expanded", String(!isExpanded));
    songListToggle.textContent = isExpanded ? "Show songs" : "Hide songs";
});

songSearch.addEventListener("input", () => {
    const searchText = songSearch.value.trim().toLowerCase();

    songItems.forEach((item, index) => {
        item.hidden = !songs[index].songName.toLowerCase().includes(searchText);
    });
});

songsContainer.addEventListener("click", (event) => {
    const songItem = event.target.closest(".songItem");

    if (songItem) {
        selectSong(Number(songItem.dataset.index));
    }
});

masterPlay.addEventListener("click", () => {
    if (audioElement.paused) {
        resumeSong();
    }
    else {
        pauseSong();
    }
});

audioElement.addEventListener("timeupdate", () => {
    if (!audioElement.duration) {
        return;
    }

    progressBar.value =
        (audioElement.currentTime / audioElement.duration) * 100;
    currentTime.textContent = formatTime(audioElement.currentTime);
});

audioElement.addEventListener("loadedmetadata", () => {
    totalTime.textContent = formatTime(audioElement.duration);
});

progressBar.addEventListener("input", () => {
    if (audioElement.duration) {
        audioElement.currentTime =
            (progressBar.value * audioElement.duration) / 100;
    }
});

const getRandomSong = () => {
    if (songs.length <= 1) {
        return songIndex;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * songs.length);
    }
    while (randomIndex === songIndex);

    return randomIndex;
};

const nextSong = (manualChange = true) => {
    if (shuffle.classList.contains("active")) {
        songIndex = getRandomSong();
    }
    else {
        songIndex = (songIndex + 1) % songs.length;
    }

    playSong(manualChange);
};

const previousSong = (manualChange = true) => {
    if (shuffle.classList.contains("active")) {
        songIndex = getRandomSong();
    }
    else {
        songIndex = songIndex <= 0 ? songs.length - 1 : songIndex - 1;
    }

    playSong(manualChange);
};

forward.addEventListener("click", () => nextSong());
backward.addEventListener("click", () => previousSong());

shuffle.addEventListener("click", () => {
    shuffle.classList.toggle("active");

    if (shuffle.classList.contains("active")) {
        disableRepeat();
    }
});

repeat.addEventListener("click", () => {
    repeat.classList.toggle("active");

    if (repeat.classList.contains("active")) {
        disableShuffle();
    }
});

audioElement.addEventListener("ended", () => {
    if (repeat.classList.contains("active")) {
        playSong(false);
    }
    else {
        nextSong(false);
    }
});

audioElement.volume = 1;

volumeBar.addEventListener("input", () => {
    audioElement.volume = volumeBar.value;
    muteButton.querySelector("img").src = audioElement.volume === 0
        ? "assets/mute.png"
        : "assets/volume.png";
});

muteButton.addEventListener("click", () => {
    if (audioElement.volume > 0) {
        audioElement.volume = 0;
        volumeBar.value = 0;
        muteButton.querySelector("img").src = "assets/mute.png";
    }
    else {
        audioElement.volume = 1;
        volumeBar.value = 1;
        muteButton.querySelector("img").src = "assets/volume.png";
    }
});
