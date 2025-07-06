const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("songTitle");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const volUpBtn = document.getElementById("vol-up");
const volDownBtn = document.getElementById("vol-down");
const songGrid = document.getElementById("songGrid");
const searchToggle = document.getElementById("searchToggle");
const searchBox = document.getElementById("searchBox");
const themeToggle = document.getElementById("themeToggle");
const categoryTabs = document.querySelectorAll(".tab");
const homeBtn = document.getElementById("homeBtn");
const libraryBtn = document.getElementById("libraryBtn");
const libraryGrid = document.getElementById("libraryGrid");
const logo = document.getElementById("logo");
const seekBar = document.getElementById("seekBar");

let currentSongIndex = 0;
let filteredSongs = [...songs];
let activeCategory = "";

function loadSong(index) {
  const song = filteredSongs[index];
  audio.src = song.file;
  cover.src = song.cover;
  title.textContent = song.title;
  seekBar.value = 0;
}

function playPauseSong() {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸️";
  } else {
    audio.pause();
    playBtn.textContent = "▶️";
  }
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % filteredSongs.length;
  loadSong(currentSongIndex);
  audio.play();
  playBtn.textContent = "⏸️";
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + filteredSongs.length) % filteredSongs.length;
  loadSong(currentSongIndex);
  audio.play();
  playBtn.textContent = "⏸️";
}

function createSongCards(songList) {
  songGrid.innerHTML = "";
  songList.forEach((song, index) => {
    const card = document.createElement("div");
    card.className = "song-card";
    card.innerHTML = `
      <img src="${song.cover}" alt="${song.title}" />
      <h4>${song.title}</h4>
    `;
    card.onclick = () => {
      currentSongIndex = index;
      filteredSongs = songList;
      loadSong(index);
      audio.play();
      playBtn.textContent = "⏸️";
    };
    songGrid.appendChild(card);
  });
}

function normalizeCategory(str) {
  return str.toLowerCase().replace(/\s+/g, "");
}

function handleCategoryFilter(categoryText, buttonElement) {
  const cleanCategory = normalizeCategory(categoryText);
  if (activeCategory === cleanCategory) {
    activeCategory = "";
    filteredSongs = [...songs];
    categoryTabs.forEach(tab => tab.classList.remove("active"));
  } else {
    activeCategory = cleanCategory;
    filteredSongs = songs.filter(song =>
      normalizeCategory(song.category) === cleanCategory
    );
    categoryTabs.forEach(tab => tab.classList.remove("active"));
    if (buttonElement) buttonElement.classList.add("active");
  }

  libraryGrid.style.display = "none";
  songGrid.style.display = "grid";
  createSongCards(filteredSongs);
  currentSongIndex = 0;
  if (filteredSongs.length > 0) loadSong(0);
}

function showLibraryCategories() {
  songGrid.style.display = "none";
  libraryGrid.style.display = "flex";
  libraryGrid.innerHTML = "";
  const categories = ["Top Picks", "Trending", "Popular", "Latest"];
  categories.forEach(cat => {
    const card = document.createElement("div");
    card.className = "library-card";
    card.textContent = cat;
    card.onclick = () => handleCategoryFilter(cat, null);
    libraryGrid.appendChild(card);
  });
}

playBtn.onclick = playPauseSong;
nextBtn.onclick = nextSong;
prevBtn.onclick = prevSong;

volUpBtn.onclick = () => {
  if (audio.volume < 1) audio.volume = Math.min(1, audio.volume + 0.1);
};

volDownBtn.onclick = () => {
  if (audio.volume > 0) audio.volume = Math.max(0, audio.volume - 0.1);
};

themeToggle.onclick = () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  themeToggle.textContent = isLight ? "🌙" : "🌞";

  const logoImage = document.getElementById("logoImage");
  logoImage.src = isLight ? "images/retina-logo.png" : "images/logo.png";
};

searchToggle.onclick = () => {
  const isVisible = searchBox.style.display === "block";
  searchBox.style.display = isVisible ? "none" : "block";
};

searchBox.addEventListener("keyup", () => {
  const query = searchBox.value.toLowerCase();
  const results = songs.filter(song => song.title.toLowerCase().includes(query));
  filteredSongs = results;
  createSongCards(filteredSongs);
  currentSongIndex = 0;
  if (results.length > 0) loadSong(0);
});

categoryTabs.forEach(tab => {
  tab.onclick = () => handleCategoryFilter(tab.textContent.trim(), tab);
});

homeBtn.onclick = () => {
  activeCategory = "";
  filteredSongs = [...songs];
  createSongCards(filteredSongs);
  songGrid.style.display = "grid";
  libraryGrid.style.display = "none";
  categoryTabs.forEach(tab => tab.classList.remove("active"));
};

logo.onclick = () => homeBtn.click();
libraryBtn.onclick = showLibraryCategories;

// Seek bar syncing
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    seekBar.max = audio.duration;
    seekBar.value = audio.currentTime;
  }
});

seekBar.addEventListener("input", () => {
  audio.currentTime = seekBar.value;
});

// Init
createSongCards(songs);
loadSong(currentSongIndex);
