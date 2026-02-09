const FRIEND_NAME = "My Safe Space💖";

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

// Videos + messages
const videoFiles = [
  {
    src: "assets/videos/01.mp4",
    message: "الصداقة ليست أن نكون متشابهين، بل أن نبقى معاً رغم كل شيء."
  },
  {
    src: "assets/videos/02.mp4",
    message: "“Some people are worth melting for.” – Frozen"
  },
  {
    src: "assets/videos/03.mp4",
    message: "“No matter how far apart we are, you’ll always be with me.” – The Lion King II"
  },
  {
    src: "assets/videos/04.mp4",
    message: "“We stick together, no matter what.” – Frozen"
  },
  {
    src: "assets/videos/05.mp4",
    message: "“You don’t have to face the world alone.” – Winnie the Pooh"
  },
  {
    src: "assets/videos/06.mp4",
    message: "“That’s what friends do.” – Frozen"
  },
  {
    src: "assets/videos/07.mp4",
    message: "“When I look at you, I feel like I’m home.” – Finding Nemo / Dory"
  },
  {
    src: "assets/videos/08.mp4",
    message: "“Our friendship is the best adventure we’ll ever have.” – The Incredibles"
  },
  {
    src: "assets/videos/09.mp4",
    message: "Our friendship is my favorite story, and I’m thankful for every chapter with you. 💖"
  },
  // If you still have more videos (10..13), add messages or reuse:
  {
    src: "assets/videos/10.mp4",
    message: "Memory #10 💕"
  },
  {
    src: "assets/videos/11.mp4",
    message: "Memory #11 ✨"
  },
  {
    src: "assets/videos/12.mp4",
    message: "Memory #12 💫"
  },
  {
    src: "assets/videos/13.mp4",
    message: "Memory #13 😂"
  },
];

function $(id) {
  return document.getElementById(id);
}

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
    try {
      await bgAudio.play();
    } catch (e) {
      // Autoplay blocked on mobile until user clicks Play (normal)
    }
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

  // ---------- Videos (with messages) ----------
  videoFiles.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "video-item";

    const v = document.createElement("video");
    v.src = item.src;
    v.controls = true;
    v.playsInline = true;

    v.addEventListener("play", () => {
      bgAudio.pause();
      playBtn.textContent = "Play";
    });

    const caption = document.createElement("p");
    caption.className = "video-caption";
    caption.textContent = item.message || "";

    wrapper.appendChild(v);
    wrapper.appendChild(caption);
    videosEl.appendChild(wrapper);
  });

  // ---------- Card Swipe (drag with finger) ----------
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  const SWIPE_THRESHOLD = 80; // px
  const ROTATE_FACTOR = 12; // deg max

  function setTransform(dx) {
    const w = viewer.getBoundingClientRect().width;
    const rotate = (dx / w) * ROTATE_FACTOR;
    cardTrack.style.transform = `translateX(${dx}px) rotate(${rotate}deg)`;
  }

  function resetCard() {
    cardTrack.classList.remove("dragging");
    cardTrack.style.transform = "translateX(0px) rotate(0deg)";
  }

  function animateOut(direction) {
    // direction: 1 = right (prev), -1 = left (next)
    const w = viewer.getBoundingClientRect().width;
    cardTrack.classList.remove("dragging");
    cardTrack.style.transform = `translateX(${direction * w * 1.2}px) rotate(${direction * 18}deg)`;

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
      animateOut(-1);
    } else if (dx >= SWIPE_THRESHOLD) {
      animateOut(1);
    } else {
      resetCard();
    }
  }

  // Touch
  viewer.addEventListener("touchstart", (e) => onStart(e.touches[0].clientX), { passive: true });
  viewer.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX), { passive: true });
  viewer.addEventListener("touchend", onEnd, { passive: true });

  // Mouse (desktop)
  viewer.addEventListener("mousedown", (e) => onStart(e.clientX));
  window.addEventListener("mousemove", (e) => onMove(e.clientX));
  window.addEventListener("mouseup", onEnd);

  // Init
  showPhoto(0);
  updateSongLabel();
  playBtn.textContent = "Play";
  muteBtn.textContent = "Mute";
});
