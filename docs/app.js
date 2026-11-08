// Edit this list to change the slideshow. Image paths are relative to this folder.
const memories = [
  { image: "assets/images/photo-01-replacement.jpg", caption: "The barber gave me a disaster, you gave me styling tips. Only you could make my worst haircut feel like a makeover." },
  { image: "assets/images/photo-02.jpeg", caption: "From morning light to night, you were all I needed. Our first day like this, and I knew I wanted a thousand more." },
  { image: "assets/images/photo-03.jpeg", caption: "You searched for a keychain for me, and I put a flower in your hair. You said it wouldn't stay. It did, and you looked beautiful." },
  { image: "assets/images/photo-04-replacement.png", caption: "Shriya, the puppy was less scared than you. First time holding one, and you looked like you were defusing a bomb. Proud of you anyway!" },
  { image: "assets/images/photo-05-replacement.png", caption: "Today we just saw if you fit. Someday I'll teach you to ride, and I'll be right beside you for every mile." },
  { image: "assets/images/photo-06.jpeg", caption: "Our first late night together, just pizza, talking, and you across the table. I didn't want the evening to end." },
  { image: "assets/images/photo-07.jpeg", caption: "A pinky promise with a french fry on top? Who even thinks of this? Us. Two geniuses, zero common sense, and I wouldn't have it any other way." },
  { image: "assets/images/photo-08.jpeg", caption: "You say you don't like flowers, but you lit up like one when I gave you this. I'll always find a reason to surprise you." },
  { image: "assets/images/photo-09.jpeg", caption: "Hungry again? Of course you are. Somehow even the way you take a bite is the cutest thing ever." },
  { image: "assets/images/photo-10.png", caption: "You sent me this right before bed, and now I can't sleep without thinking of you. Even in my dreams, I'm looking for you." },
  { image: "assets/images/photo-11.jpeg", caption: "Our first California Burrito date, and you hid from my camera. Too late, Shriya, I already got the cutest shot." },
  { image: "assets/images/photo-12-replacement.jpg", caption: "You were my camera crew for band practice, and I was the bossy director. But the best shot of the day was the one I stole of you." },
  { image: "assets/images/photo-13.jpeg", caption: "Serious flavour research in progress. Plot twist, she picks mine too. Best ice cream partner ever." },
  { image: "assets/images/photo-14.jpeg", caption: "Was being cute, got bitten. No warning, no explanation, just teeth. Still love you, Shriya, but I'm keeping my hands to myself." },
  { image: "assets/images/photo-15.jpeg", caption: "Everyone says we look good together, and my heart agrees. Whatever comes, I'll keep choosing you, quietly and gladly, every single day. Happy birthday, Shriya." }
];

const $ = (selector) => document.querySelector(selector);
const screens = [$("#intro"), $("#memories"), $("#finale")];
const guitar = $("#guitar-audio");
const voice = $("#voice-audio");
const kinderPolaroid = $("#kinder-polaroid");
const photo = $("#memory-photo");
const photoPlaceholder = $("#photo-placeholder");
const photoStack = $(".photo-stack");
const musicMeter = $(".music-meter");
const musicMeterFill = $(".music-meter i");
const toast = $("#audio-toast");
const videoModal = $("#video-modal");
const keyModal = $("#key-modal");
const birthdayVideo = $("#birthday-video");
// Change this single path if you replace the sticky-note video.
const BIRTHDAY_VIDEO_SRC = "assets/video/sticky-note-video.mp4";
let current = 0;
let toastTimer;
let treasureStep = 0;
let stickyDone = false;
let modalTrigger = null;
let videoEndTimer;
let videoCloseTimer;
let kinderFadeTimer;
let kinderHideTimer;

function showScreen(index) {
  screens.forEach((screen, i) => {
    const active = i === index;
    screen.classList.toggle("is-active", active);
    screen.setAttribute("aria-hidden", String(!active));
  });
  $("#audio-control").hidden = index !== 2;
}

function announce(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3600);
}

function updateMusicButtons() {
  const playing = !guitar.paused;
  document.querySelectorAll(".music-toggle").forEach((button) => {
    button.setAttribute("aria-pressed", String(playing));
    button.setAttribute("aria-label", playing ? "Pause guitar music" : "Resume guitar music");
  });
}

function updateMusicProgress() {
  const duration = guitar.duration;
  const progress = Number.isFinite(duration) && duration > 0
    ? Math.min(100, Math.max(0, (guitar.currentTime / duration) * 100))
    : 0;
  musicMeterFill.style.width = `${progress}%`;
  musicMeter.setAttribute("aria-valuenow", String(Math.round(progress)));
}

async function startGuitar() {
  try {
    await guitar.play();
    updateMusicButtons();
  } catch {
    updateMusicButtons();
    announce("Add your guitar recording at assets/audio/guitar.mp3 to hear the music.");
  }
}

function renderPhoto(animate = false) {
  const memory = memories[current];
  $("#photo-caption").textContent = memory.caption;
  photo.classList.toggle("show-more", [0, 4, 9].includes(current));
  $("#photo-window").classList.toggle("portrait-frame", current === 3);
  photoStack.classList.toggle("portrait-photo", current === 3);
  photoStack.classList.toggle("last-photo", current === memories.length - 1);
  $(".previous").disabled = current === 0;
  $(".previous").setAttribute("aria-label", current === 0 ? "First photo" : "Previous photo");
  $(".next").disabled = current === memories.length - 1;
  $(".next").setAttribute("aria-label", current === memories.length - 1 ? "Last photo" : "Next photo");
  $("#last-thing").classList.toggle("is-visible", current === memories.length - 1);
  $("#last-thing").setAttribute("tabindex", current === memories.length - 1 ? "0" : "-1");
  photo.classList.remove("loaded");
  photoPlaceholder.hidden = false;
  photoPlaceholder.style.display = "grid";
  photo.alt = `Memory ${current + 1}: ${memory.caption}`;
  photo.onload = () => {
    photo.classList.add("loaded");
    photoPlaceholder.hidden = true;
    photoPlaceholder.style.display = "none";
  };
  photo.onerror = () => {
    photo.classList.remove("loaded");
    photoPlaceholder.hidden = false;
    photoPlaceholder.style.display = "grid";
  };
  photo.src = memory.image;
  if (animate) {
    photoStack.classList.add("is-changing");
    setTimeout(() => photoStack.classList.remove("is-changing"), 260);
  }
}

function movePhoto(direction) {
  const next = Math.max(0, Math.min(memories.length - 1, current + direction));
  if (next === current) return;
  current = next;
  renderPhoto(true);
}

function resetKinderPhoto() {
  clearTimeout(kinderFadeTimer);
  clearTimeout(kinderHideTimer);
  kinderPolaroid.hidden = true;
  kinderPolaroid.classList.remove("is-popping", "is-fading");
}

function revealKinderPhoto() {
  if (!kinderPolaroid.hidden) return;
  clearTimeout(kinderFadeTimer);
  clearTimeout(kinderHideTimer);
  kinderPolaroid.hidden = false;
  kinderPolaroid.classList.remove("is-fading", "is-popping");
  void kinderPolaroid.offsetWidth;
  kinderPolaroid.classList.add("is-popping");
}

function scheduleKinderPhotoFade() {
  clearTimeout(kinderFadeTimer);
  clearTimeout(kinderHideTimer);
  kinderFadeTimer = setTimeout(() => {
    if (kinderPolaroid.hidden) return;
    kinderPolaroid.classList.add("is-fading");
    kinderHideTimer = setTimeout(resetKinderPhoto, 600);
  }, 2000);
}

kinderPolaroid.addEventListener("animationend", (event) => {
  if (event.target === kinderPolaroid && event.animationName === "kinderSlap") {
    kinderPolaroid.classList.remove("is-popping");
  }
});

function shake(element) {
  element.classList.remove("soft-shake");
  void element.offsetWidth;
  element.classList.add("soft-shake");
  element.addEventListener("animationend", () => element.classList.remove("soft-shake"), { once: true });
}

function setNoteReady(element, ready) {
  element.classList.toggle("awaiting-tap", ready);
  element.setAttribute("aria-disabled", String(!ready));
  if (element.id === "intro-note") element.classList.toggle("glow", Boolean(ready && stickyDone));
}

function openVideoCard() {
  modalTrigger = $("#birthday-tag");
  clearTimeout(videoEndTimer);
  clearTimeout(videoCloseTimer);
  videoModal.classList.remove("is-closing");
  videoModal.hidden = false;
  videoModal.querySelector(".modal-close").focus();
  birthdayVideo.src = BIRTHDAY_VIDEO_SRC;
  birthdayVideo.loop = false;
  birthdayVideo.currentTime = 0;
  birthdayVideo.muted = false;
  updateVideoMuteButton();
  const playback = birthdayVideo.play();
  playback?.catch(async () => {
    birthdayVideo.muted = true;
    updateVideoMuteButton();
    try { await birthdayVideo.play(); } catch { /* Keep the card open if media playback is unavailable. */ }
  });
}

function sizeVideoCard() {
  if (!birthdayVideo.videoWidth || !birthdayVideo.videoHeight) return;
  const ratio = birthdayVideo.videoWidth / birthdayVideo.videoHeight;
  const viewportWidth = window.visualViewport?.width || window.innerWidth;
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const width = Math.max(1, Math.floor(Math.min(viewportWidth * 0.92 - 4, 480, viewportHeight * 0.88 * ratio)));
  birthdayVideo.style.width = `${width}px`;
  birthdayVideo.style.height = `${width / ratio}px`;
  birthdayVideo.style.aspectRatio = `${birthdayVideo.videoWidth} / ${birthdayVideo.videoHeight}`;
}

function closeVideoCard() {
  if (videoModal.hidden || videoModal.classList.contains("is-closing")) return;
  clearTimeout(videoEndTimer);
  stickyDone = true;
  treasureStep = 2;
  setNoteReady($("#birthday-tag"), false);
  setNoteReady($("#intro-note"), true);
  birthdayVideo.pause();
  videoModal.classList.add("is-closing");
  videoCloseTimer = setTimeout(() => {
    videoModal.hidden = true;
    videoModal.classList.remove("is-closing");
    birthdayVideo.currentTime = 0;
    modalTrigger?.focus();
  }, 300);
}

function updateVideoMuteButton() {
  const button = $("#video-mute");
  const muted = birthdayVideo.muted;
  button.textContent = muted ? "🔇" : "🔊";
  button.setAttribute("aria-label", muted ? "Unmute video" : "Mute video");
  button.setAttribute("aria-pressed", String(muted));
}

function closeKeyCard() {
  keyModal.hidden = true;
  $("#intro-note").focus();
}

$("#open-surprise").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  if (treasureStep === 0) {
    treasureStep = 1;
    $("#treasure-hint").textContent = "It's locked... maybe the little note knows why. ♡";
    setNoteReady($("#birthday-tag"), true);
    shake(button);
    return;
  }
  if (treasureStep < 3) {
    shake(button);
    return;
  }
  showScreen(1);
  renderPhoto();
  await startGuitar();
});

$("#birthday-tag").addEventListener("click", () => {
  if (treasureStep === 1) openVideoCard();
  else shake($("#birthday-tag"));
});
$("#intro-note").addEventListener("click", () => {
  if (stickyDone && treasureStep === 2) {
    modalTrigger = $("#intro-note");
    keyModal.hidden = false;
    keyModal.querySelector(".modal-close").focus();
  }
});
[$("#birthday-tag"), $("#intro-note")].forEach((element) => element.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  element.click();
}));

videoModal.querySelector(".modal-close").addEventListener("click", closeVideoCard);
videoModal.addEventListener("click", (event) => { if (event.target === videoModal) closeVideoCard(); });
$("#video-mute").addEventListener("click", () => {
  birthdayVideo.muted = !birthdayVideo.muted;
  updateVideoMuteButton();
});
birthdayVideo.addEventListener("ended", () => {
  clearTimeout(videoEndTimer);
  videoEndTimer = setTimeout(closeVideoCard, 1000);
});
birthdayVideo.addEventListener("loadedmetadata", sizeVideoCard);
window.addEventListener("resize", sizeVideoCard);
keyModal.querySelector(".modal-close").addEventListener("click", closeKeyCard);
keyModal.addEventListener("click", (event) => { if (event.target === keyModal) closeKeyCard(); });
$("#unlock-key").addEventListener("click", () => {
  if (treasureStep !== 2) return;
  const key = $("#unlock-key");
  key.classList.add("is-turning");
  treasureStep = 3;
  setNoteReady($("#intro-note"), false);
  $("#surprise-heart").textContent = "♡";
  $("#surprise-heart").classList.add("is-opening");
  const button = $("#open-surprise");
  button.classList.remove("is-locked");
  button.classList.add("is-unlocked");
  button.setAttribute("aria-label", "Open Your Birthday Surprise");
  $("#treasure-hint").textContent = "Unlocked. ♡";
  setTimeout(() => {
    keyModal.hidden = true;
    key.classList.remove("is-turning");
    $("#open-surprise").focus();
  }, 720);
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!videoModal.hidden) closeVideoCard();
  else if (!keyModal.hidden) closeKeyCard();
});
document.querySelectorAll(".music-toggle").forEach((button) => button.addEventListener("click", async () => {
  if (guitar.paused) await startGuitar();
  else { guitar.pause(); updateMusicButtons(); }
}));
$(".previous").addEventListener("click", () => movePhoto(-1));
$(".next").addEventListener("click", () => movePhoto(1));
$("#last-thing").addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  showScreen(2);
});
$("#back-to-photos").addEventListener("click", () => showScreen(1));

$("#voice-button").addEventListener("click", async () => {
  const button = $("#voice-button");
  const status = $("#voice-status");
  if (!voice.paused) {
    voice.pause();
    button.classList.remove("is-playing");
    $(".voice-label").textContent = "Resume My Voice Note";
    status.textContent = "Voice note paused.";
    return;
  }
  if (voice.ended) {
    voice.currentTime = 0;
    resetKinderPhoto();
  }
  try {
    await voice.play();
    button.classList.add("is-playing");
    $(".voice-label").textContent = "Pause My Voice Note";
    status.textContent = "Playing your voice note…";
  } catch {
    announce("Add your voice message at assets/audio/voice-note.mp3 to hear it.");
    status.textContent = "Add your recording at assets/audio/voice-note.mp3, then press play.";
  }
});
voice.addEventListener("ended", () => {
  $("#voice-button").classList.remove("is-playing");
  $(".voice-label").textContent = "Play My Voice Note";
  $("#voice-status").textContent = "I hope you felt every word. ♡";
  scheduleKinderPhotoFade();
});
voice.addEventListener("timeupdate", () => {
  if (!voice.paused && !voice.ended && voice.currentTime >= 55) revealKinderPhoto();
});
voice.addEventListener("play", () => {
  clearTimeout(kinderFadeTimer);
  clearTimeout(kinderHideTimer);
  kinderPolaroid.classList.remove("is-fading");
  if (voice.currentTime >= 55) revealKinderPhoto();
  else resetKinderPhoto();
});
voice.addEventListener("pause", () => {
  if (voice.ended) return;
  $("#voice-button").classList.remove("is-playing");
});

let touchStartX = 0;
$(".gallery-stage").addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
$(".gallery-stage").addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 45) movePhoto(delta < 0 ? 1 : -1);
}, { passive: true });
document.addEventListener("keydown", (event) => {
  if (!$("#memories").classList.contains("is-active")) return;
  if (event.key === "ArrowLeft") movePhoto(-1);
  if (event.key === "ArrowRight") movePhoto(1);
});

guitar.addEventListener("play", updateMusicButtons);
guitar.addEventListener("pause", updateMusicButtons);
guitar.addEventListener("timeupdate", updateMusicProgress);
guitar.addEventListener("loadedmetadata", updateMusicProgress);
guitar.addEventListener("durationchange", updateMusicProgress);
guitar.addEventListener("seeked", updateMusicProgress);
renderPhoto();
