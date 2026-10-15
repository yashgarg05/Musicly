let songIndex = 0;

let audioElement = new Audio("songs/pokemon.mp3");

let masterPlay = document.getElementById("masterPlay");
let progressBar = document.getElementById("progressBar");
let backward = document.getElementById("backward");
let forward = document.getElementById("forward");

let masterName = document.getElementById("masterName");
let masterCover = document.getElementById("masterCover");

let currentTime = document.getElementById("currentTime");
let totalTime = document.getElementById("totalTime");

let playerStatus = document.getElementById("playerStatus");

let volumeBar = document.getElementById("volumeBar");
let muteButton = document.getElementById("muteButton");

let shuffle = document.getElementById("shuffle");
let repeat = document.getElementById("repeat");

let playBtn = Array.from(
    document.getElementsByClassName("playbtn")
);

let songItems = Array.from(
    document.getElementsByClassName("songItem")
);

let timestamps = Array.from(
    document.getElementsByClassName("timestamp")
);


/* All songs */

let songs = [

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


/* Convert seconds into minutes:seconds */

const formatTime = (seconds) => {

    if (!seconds || isNaN(seconds)) {
        return "0:00";
    }

    let minutes = Math.floor(seconds / 60);

    let secondsPart = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${secondsPart}`;

};


/* Reset all small play buttons */

const makeAllPlays = () => {

    playBtn.forEach((element) => {

        element.src = "assets/play-button.png";

    });

};


/* Remove active state from all songs */

const makeAllInactive = () => {

    songItems.forEach((item) => {

        item.classList.remove("active");

    });

};


/* Turn Repeat off */

const disableRepeat = () => {

    repeat.classList.remove("active");

};


/* Turn Shuffle off */

const disableShuffle = () => {

    shuffle.classList.remove("active");

};


/*
    Play a song.

    manualChange = true means the user selected/ch
    changed the song themselves.

    manualChange = false means the song changed
    automatically after finishing.
*/

const playSong = (manualChange = true) => {

    /* Manual song change should turn Repeat off */

    if (manualChange) {

        disableRepeat();

    }


    makeAllPlays();

    makeAllInactive();


    playBtn[songIndex].src =
        "assets/pause.png";

    songItems[songIndex].classList.add("active");


    masterName.innerText =
        songs[songIndex].songName;


    masterCover.src =
        songs[songIndex].coverPath;


    playerStatus.innerText =
        "Playing now";


    audioElement.src =
        songs[songIndex].filePath;


    audioElement.currentTime = 0;

    progressBar.value = 0;

    currentTime.innerText = "0:00";

    totalTime.innerText = "0:00";


    audioElement.play();


    masterPlay.querySelector("img").src =
        "assets/pause.png";

};


/* Resume current song */

const resumeSong = () => {

    audioElement.play();

    masterPlay.querySelector("img").src =
        "assets/pause.png";

    playBtn[songIndex].src =
        "assets/pause.png";

    playerStatus.innerText =
        "Playing now";

};


/* Pause current song */

const pauseSong = () => {

    audioElement.pause();

    masterPlay.querySelector("img").src =
        "assets/play-button.png";

    playBtn[songIndex].src =
        "assets/play-button.png";

    playerStatus.innerText =
        "Paused";

};


/* Select a song from the list */

const selectSong = (index) => {

    if (songIndex === index) {

        if (audioElement.paused) {

            resumeSong();

        }
        else {

            pauseSong();

        }

    }
    else {

        songIndex = index;

        /* This is a manual song change */

        playSong(true);

    }

};


/* Main play button */

masterPlay.addEventListener("click", () => {

    if (audioElement.paused) {

        resumeSong();

    }
    else {

        pauseSong();

    }

});


/* Small play buttons */

playBtn.forEach((element, index) => {

    element.addEventListener("click", (e) => {

        e.stopPropagation();

        selectSong(index);

    });

});


/* Clicking anywhere on the song row */

songItems.forEach((item, index) => {

    item.addEventListener("click", () => {

        selectSong(index);

    });

});


/* Update progress while song is playing */

audioElement.addEventListener("timeupdate", () => {

    if (!audioElement.duration) {
        return;
    }


    progressBar.value =
        (audioElement.currentTime /
        audioElement.duration) * 100;


    currentTime.innerText =
        formatTime(audioElement.currentTime);

});


/* Get duration of current song */

audioElement.addEventListener("loadedmetadata", () => {

    totalTime.innerText =
        formatTime(audioElement.duration);

});


/* Load duration of every song */

songs.forEach((song, index) => {

    let tempAudio = new Audio();

    tempAudio.src = song.filePath;


    tempAudio.addEventListener("loadedmetadata", () => {

        timestamps[index].innerText =
            formatTime(tempAudio.duration);

    });

});


/* Seek through the song */

progressBar.addEventListener("input", () => {

    if (!audioElement.duration) {
        return;
    }


    audioElement.currentTime =
        (progressBar.value *
        audioElement.duration) / 100;

});


/* Get a random song other than the current song */

const getRandomSong = () => {

    if (songs.length <= 1) {
        return songIndex;
    }


    let randomIndex;

    do {

        randomIndex =
            Math.floor(Math.random() * songs.length);

    }
    while (randomIndex === songIndex);


    return randomIndex;

};


/*
    Go to the next song.

    If Shuffle is on:
    -> pick a random song

    Otherwise:
    -> go to the next song normally
*/

const nextSong = (manualChange = true) => {

    if (shuffle.classList.contains("active")) {

        songIndex = getRandomSong();

    }
    else {

        if (songIndex >= songs.length - 1) {

            songIndex = 0;

        }
        else {

            songIndex++;

        }

    }


    playSong(manualChange);

};


/*
    Go to the previous song.

    Shuffle also works here because the user
    is still asking for another random song.
*/

const previousSong = (manualChange = true) => {

    if (shuffle.classList.contains("active")) {

        songIndex = getRandomSong();

    }
    else {

        if (songIndex <= 0) {

            songIndex = songs.length - 1;

        }
        else {

            songIndex--;

        }

    }


    playSong(manualChange);

};


forward.addEventListener("click", () => {

    nextSong(true);

});


backward.addEventListener("click", () => {

    previousSong(true);

});


/*
    Shuffle button.

    Turning Shuffle ON automatically
    turns Repeat OFF.
*/

shuffle.addEventListener("click", () => {

    shuffle.classList.toggle("active");


    if (shuffle.classList.contains("active")) {

        disableRepeat();

    }

});


/*
    Repeat button.

    Repeat and Shuffle cannot be active
    at the same time.
*/

repeat.addEventListener("click", () => {

    repeat.classList.toggle("active");


    if (repeat.classList.contains("active")) {

        disableShuffle();

    }

});


/*
    What happens when a song finishes:

    Repeat ON
        -> play the same song again

    Shuffle ON
        -> play a random song

    Both OFF
        -> play the next song
*/

audioElement.addEventListener("ended", () => {


    /* Repeat */

    if (repeat.classList.contains("active")) {

        playSong(false);

        return;

    }


    /* Shuffle */

    if (shuffle.classList.contains("active")) {

        songIndex = getRandomSong();

        playSong(false);

        return;

    }


    /* Normal playback */

    nextSong(false);

});


/* Volume */

audioElement.volume = 1;


volumeBar.addEventListener("input", () => {

    audioElement.volume =
        volumeBar.value;


    if (audioElement.volume === 0) {

        muteButton.querySelector("img").src =
            "assets/mute.png";

    }
    else {

        muteButton.querySelector("img").src =
            "assets/volume.png";

    }

});


/* Mute / unmute */

muteButton.addEventListener("click", () => {

    if (audioElement.volume > 0) {

        audioElement.volume = 0;

        volumeBar.value = 0;

        muteButton.querySelector("img").src =
            "assets/mute.png";

    }
    else {

        audioElement.volume = 1;

        volumeBar.value = 1;

        muteButton.querySelector("img").src =
            "assets/volume.png";

    }

});