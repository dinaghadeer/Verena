const FRIEND_NAME = "Verenaaaa💖";

// Photos only
const photos = [
  { src: "assets/photos/01.jpg" },
  { src: "assets/photos/02.jpg" },
  { src: "assets/photos/03.jpg" },
  { src: "assets/photos/04.jpg" },
  { src: "assets/photos/05.jpg" },
  { src: "assets/photos/06.jpg" },
  { src: "assets/photos/07.jpg" },
  { src: "assets/photos/08.jpg" },
  { src: "assets/photos/09.jpg" },
  { src: "assets/photos/10.jpg" },
  { src: "assets/photos/11.jpg" },
  { src: "assets/photos/12.jpg" },
  { src: "assets/photos/13.jpg" },
  { src: "assets/photos/14.jpg" },
  { src: "assets/photos/15.jpg" },
  { src: "assets/photos/16.jpg" },
];

// Playlist
const playlist = [
  { src: "assets/songs/01.mp3", name: "فاكره ؟" },
  { src: "assets/songs/02.mp3", name: "اخويا ده دههه" },
  { src: "assets/songs/03.mp3", name: "معايااا اه والله" },
  { src: "assets/songs/04.mp3", name: "محدش عاش اللي انا وانتي عشناه علفكره" },
];

const videoFiles = [
  "videos/01.mp4",
  "videos/02.mp4",
  "videos/03.mp4",
  "videos/04.mp4",
  "videos/05.mp4",
  "videos/06.mp4",
  "videos/07.mp4",
  "videos/08.mp4",
  "videos/09.mp4",
  "videos/10.mp4",
  "videos/11.mp4",
  "videos/12.mp4",
  "videos/13.mp4",
];

function $(id) { return document.getElementById(id); }

document.addEventListener("DOMContentLoaded", () => {
  $("name").textContent = FRIEND_NAME;

  const viewer = $("viewer");
  const cardTrack = $("cardTrack");
  const img = $("photoImg");

  const bgAudio = $("bgAudio");
  const playBtn = $("playBtn");
  const muteBtn = $("muteBtn");

  const photoLabel = $("photoLabel");
  const songLabel = $("songLabel");
  const videosEl = $("videos");

  // ---------- Photos ----------
  let photoIndex = 0;

  function showPhoto(i) {
    const item = photos[i];
    img.src = item.src;
    photoLabel.textContent = `${i + 1} / ${photos.length}`;
  }

  function nextPhoto() {
    photoIndex = (photoIndex + 1) % photos.length;
    showPhoto(photoIndex);
  }

  function prevPhoto() {
    photoIndex = (photoIndex - 1 + photos.length) % photos.length;
    showPhoto(photoIndex);
  }

  // ---------- Playlist ----------
  let userUnlockedAudio = false;
  let playlistIndex = 0;

  function updateSongLabel() {
    if (!playlist.length) {
      songLabel.textContent = "Song: —";
      return;
    }
    songLabel.textContent = `Song: ${playlist[playlistIndex].name || "—"}`;
  }

  function loadSong(i) {
    if (!playlist.length) return;
    playlistIndex = (i + playlist.length) % playlist.length;
    bgAudio.src = playlist[playlistIndex].src;
    updateSongLabel();
  }

  async function playCurrentSong() {
    if (!playlist.length) return;
    if (!bgAudio.src) loadSong(0);
    try { await bgAudio.play(); } catch (e) {}
  }

  bgAudio.addEventListener("ended", () => {
    if (!userUnlockedAudio) return;
    loadSong(playlistIndex + 1);
    playCurrentSong();
  });

  playBtn.addEventListener("click", async () => {
    userUnlockedAudio = true;
    if (bgAudio.paused) {
      if (!bgAudio.src) loadSong(0);
      await playCurrentSong();
      playBtn.textContent = bgAudio.paused ? "Play" : "Pause";
    } else {
      bgAudio.pause();
      playBtn.textContent = "Play";
    }
  });

  muteBtn.addEventListener("click", () => {
    bgAudio.muted = !bgAudio.muted;
    muteBtn.textContent = bgAudio.muted ? "Unmute" : "Mute";
  });

  // ---------- Videos ----------
  videoFiles.forEach((src) => {
    const v = document.createElement("video");
    v.src = src;
    v.controls = true;
    v.playsInline = true;

    v.addEventListener("play", () => {
      bgAudio.pause();
      playBtn.textContent = "Play";
    });

    videosEl.appendChild(v);
  });

  // ---------- Card Swipe (drag with finger) ----------
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  const SWIPE_THRESHOLD = 80; // px
  const ROTATE_FACTOR = 12;   // deg max

  function setTransform(dx) {
    const w = viewer.getBoundingClientRect().width;
    const rotate = (dx / w) * ROTATE_FACTOR;
    cardTrack.style.transform = `translateX(${dx}px) rotate(${rotate}deg)`;
  }

  function resetCard() {
    cardTrack.classList.remove("dragging");
    cardTrack.style.transform = `translateX(0px) rotate(0deg)`;
  }

  function animateOut(direction) {
    // direction: 1 = right (prev), -1 = left (next)
    const w = viewer.getBoundingClientRect().width;
    cardTrack.classList.remove("dragging");
    cardTrack.style.transform = `translateX(${direction * w * 1.2}px) rotate(${direction * 18}deg)`;

    // after animation, switch photo + reset
    setTimeout(() => {
      if (direction === -1) nextPhoto();
      else prevPhoto();
      resetCard();
    }, 200);
  }

  function onStart(clientX) {
    dragging = true;
    startX = clientX;
    currentX = clientX;
    cardTrack.classList.add("dragging");
  }

  function onMove(clientX) {
    if (!dragging) return;
    currentX = clientX;
    const dx = currentX - startX;
    setTransform(dx);
  }

  function onEnd() {
    if (!dragging) return;
    dragging = false;

    const dx = currentX - startX;
    if (dx <= -SWIPE_THRESHOLD) {
      // swipe left -> next
      animateOut(-1);
    } else if (dx >= SWIPE_THRESHOLD) {
      // swipe right -> prev
      animateOut(1);
    } else {
      // not enough -> snap back
      resetCard();
    }
  }

  // Touch events
  viewer.addEventListener("touchstart", (e) => onStart(e.touches[0].clientX), { passive: true });
  viewer.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX), { passive: true });
  viewer.addEventListener("touchend", onEnd, { passive: true });

  // Mouse events (desktop)
  viewer.addEventListener("mousedown", (e) => onStart(e.clientX));
  window.addEventListener("mousemove", (e) => onMove(e.clientX));
  window.addEventListener("mouseup", onEnd);

  // Init
  showPhoto(0);
  updateSongLabel();
  playBtn.textContent = "Play";
  muteBtn.textContent = "Mute";
});




