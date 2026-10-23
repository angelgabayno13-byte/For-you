
const $ = (id) => document.getElementById(id);

// NICKNAME PASSWORD
const correctNickname = "Dong";

// SCREENS
const screens = document.querySelectorAll(".screen");

function showScreen(screenId) {
    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    const targetScreen = $(screenId);

    if (targetScreen) {
        targetScreen.classList.add("active");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// 1. NICKNAME PASSWORD
$("passwordForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const enteredNickname = $("nicknameInput").value
        .trim()
        .toLowerCase();

    if (enteredNickname === correctNickname.toLowerCase()) {
        $("passwordError").textContent = "";
        showScreen("envelopeScreen");
    } else {
        $("passwordError").textContent =
            "Oops! That's not the right nickname. Try again ♡";

        $("nicknameInput").value = "";
        $("nicknameInput").focus();
    }
});

// 2. OPEN ENVELOPE
let envelopeOpened = false;

function openEnvelope() {
    if (envelopeOpened) return;

    envelopeOpened = true;
    $("envelope").classList.add("open");

    playMusic();

    setTimeout(() => {
        showScreen("questionScreen");
    }, 850);
}

$("envelope").addEventListener("click", openEnvelope);
$("openEnvelopeButton").addEventListener("click", openEnvelope);

// 3. YES / NO BUTTONS
let noClickCount = 0;

$("noButton").addEventListener("click", function() {
    noClickCount++;

    const scale = Math.min(1 + noClickCount * 0.045, 1.22);

    this.style.transform = `scale(${scale})`;
    this.style.fontSize = `${14 + Math.min(noClickCount, 4)}px`;
    this.style.padding =
        `${13 + Math.min(noClickCount, 4)}px ` +
        `${22 + Math.min(noClickCount * 2, 8)}px`;
});

$("yesButton").addEventListener("click", function() {
    showScreen("thankYouScreen");
});

// 4. ENTER DASHBOARD
$("enterDashboardButton").addEventListener("click", function() {
    showScreen("dashboardScreen");
    showPage("homePage");
});

// 5. DASHBOARD TABS
const tabs = document.querySelectorAll(".tab");
const pages = document.querySelectorAll(".tab-page");

function showPage(pageId) {
    pages.forEach(page => {
        page.classList.toggle("hidden", page.id !== pageId);
        page.classList.toggle("active", page.id === pageId);
    });

    tabs.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.page === pageId);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

tabs.forEach(tab => {
    tab.addEventListener("click", function() {
        showPage(this.dataset.page);
    });
});

// 6. MUSIC CONTROLS
const music = $("backgroundMusic");

const musicButtons = [
    $("dashboardMusicButton"),
    $("playMusicButton")
];

async function playMusic() {
    try {
        await music.play();
        updateMusicUI(true);
    } catch (error) {
        updateMusicUI(false);
        $("musicStatus").textContent =
            "Tap Play Our Song to start the music ♡";
    }
}

function pauseMusic() {
    music.pause();
    updateMusicUI(false);
}

function updateMusicUI(isPlaying) {
    $("dashboardMusicButton").textContent =
        isPlaying ? "Ⅱ Pause" : "♫ Music";

    $("playMusicButton").textContent =
        isPlaying ? "Ⅱ Pause Our Song" : "▶ Play Our Song";

    $("musicStatus").textContent =
        isPlaying ? "Now playing ♡" : "Ready when you are ♡";

    const record = document.querySelector(".record");

    if (record) {
        record.classList.toggle("playing", isPlaying);
    }
}

function toggleMusic() {
    if (music.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
}

musicButtons.forEach(button => {
    button.addEventListener("click", toggleMusic);
});

music.addEventListener("ended", () => {
    updateMusicUI(false);
});

music.addEventListener("error", () => {
    updateMusicUI(false);
    $("musicStatus").textContent =
        "Music file not found. Check your music source ♡";
});
