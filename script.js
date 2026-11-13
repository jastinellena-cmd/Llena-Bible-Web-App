
/* ==========================================
   WORD OF LIFE - BIBLE READER
   Bible API: https://bible-api.com/
========================================== */

/* ---------- BIBLE BOOK DATABASE ---------- */

const bibleBooks = [
  { name: "Genesis", chapters: 50, testament: "old" },
  { name: "Exodus", chapters: 40, testament: "old" },
  { name: "Leviticus", chapters: 27, testament: "old" },
  { name: "Numbers", chapters: 36, testament: "old" },
  { name: "Deuteronomy", chapters: 34, testament: "old" },
  { name: "Joshua", chapters: 24, testament: "old" },
  { name: "Judges", chapters: 21, testament: "old" },
  { name: "Ruth", chapters: 4, testament: "old" },
  { name: "1 Samuel", chapters: 31, testament: "old" },
  { name: "2 Samuel", chapters: 24, testament: "old" },
  { name: "1 Kings", chapters: 22, testament: "old" },
  { name: "2 Kings", chapters: 25, testament: "old" },
  { name: "1 Chronicles", chapters: 29, testament: "old" },
  { name: "2 Chronicles", chapters: 36, testament: "old" },
  { name: "Ezra", chapters: 10, testament: "old" },
  { name: "Nehemiah", chapters: 13, testament: "old" },
  { name: "Esther", chapters: 10, testament: "old" },
  { name: "Job", chapters: 42, testament: "old" },
  { name: "Psalms", chapters: 150, testament: "old" },
  { name: "Proverbs", chapters: 31, testament: "old" },
  { name: "Ecclesiastes", chapters: 12, testament: "old" },
  { name: "Song of Solomon", chapters: 8, testament: "old" },
  { name: "Isaiah", chapters: 66, testament: "old" },
  { name: "Jeremiah", chapters: 52, testament: "old" },
  { name: "Lamentations", chapters: 5, testament: "old" },
  { name: "Ezekiel", chapters: 48, testament: "old" },
  { name: "Daniel", chapters: 12, testament: "old" },
  { name: "Hosea", chapters: 14, testament: "old" },
  { name: "Joel", chapters: 3, testament: "old" },
  { name: "Amos", chapters: 9, testament: "old" },
  { name: "Obadiah", chapters: 1, testament: "old" },
  { name: "Jonah", chapters: 4, testament: "old" },
  { name: "Micah", chapters: 7, testament: "old" },
  { name: "Nahum", chapters: 3, testament: "old" },
  { name: "Habakkuk", chapters: 3, testament: "old" },
  { name: "Zephaniah", chapters: 3, testament: "old" },
  { name: "Haggai", chapters: 2, testament: "old" },
  { name: "Zechariah", chapters: 14, testament: "old" },
  { name: "Malachi", chapters: 4, testament: "old" },
  { name: "Matthew", chapters: 28, testament: "new" },
  { name: "Mark", chapters: 16, testament: "new" },
  { name: "Luke", chapters: 24, testament: "new" },
  { name: "John", chapters: 21, testament: "new" },
  { name: "Acts", chapters: 28, testament: "new" },
  { name: "Romans", chapters: 16, testament: "new" },
  { name: "1 Corinthians", chapters: 16, testament: "new" },
  { name: "2 Corinthians", chapters: 13, testament: "new" },
  { name: "Galatians", chapters: 6, testament: "new" },
  { name: "Ephesians", chapters: 6, testament: "new" },
  { name: "Philippians", chapters: 4, testament: "new" },
  { name: "Colossians", chapters: 4, testament: "new" },
  { name: "1 Thessalonians", chapters: 5, testament: "new" },
  { name: "2 Thessalonians", chapters: 3, testament: "new" },
  { name: "1 Timothy", chapters: 6, testament: "new" },
  { name: "2 Timothy", chapters: 4, testament: "new" },
  { name: "Titus", chapters: 3, testament: "new" },
  { name: "Philemon", chapters: 1, testament: "new" },
  { name: "Hebrews", chapters: 13, testament: "new" },
  { name: "James", chapters: 5, testament: "new" },
  { name: "1 Peter", chapters: 5, testament: "new" },
  { name: "2 Peter", chapters: 3, testament: "new" },
  { name: "1 John", chapters: 5, testament: "new" },
  { name: "2 John", chapters: 1, testament: "new" },
  { name: "3 John", chapters: 1, testament: "new" },
  { name: "Jude", chapters: 1, testament: "new" },
  { name: "Revelation", chapters: 22, testament: "new" }
];

/* ---------- APPLICATION STATE ---------- */

const API_URL = "https://bible-api.com/";

let selectedBook = "Genesis";
let selectedChapter = 1;
let currentPassage = null;
let currentView = "reader";
let currentTestament = "all";

const $ = (id) => document.getElementById(id);

/* ---------- AUTHENTICATION DEMO ---------- */

function getAccounts() {
  return JSON.parse(localStorage.getItem("wol_accounts") || "[]");
}

function saveAccounts(accounts) {
  localStorage.setItem("wol_accounts", JSON.stringify(accounts));
}

function showLogin() {
  $("authScreen").classList.remove("hidden");
  $("appScreen").classList.add("hidden");
}

function showApplication(user) {
  $("authScreen").classList.add("hidden");
  $("appScreen").classList.remove("hidden");
  $("welcomeText").textContent = `Welcome, ${user.name}!`;
  initializeApplication();
}

function switchAuthTab(tab) {
  const loginMode = tab === "login";

  $("loginForm").classList.toggle("hidden", !loginMode);
  $("registerForm").classList.toggle("hidden", loginMode);

  $("loginTab").classList.toggle("active", loginMode);
  $("registerTab").classList.toggle("active", !loginMode);

  $("loginMessage").textContent = "";
  $("registerMessage").textContent = "";
}

$("loginTab").addEventListener("click", () => switchAuthTab("login"));
$("registerTab").addEventListener("click", () => switchAuthTab("register"));

$("registerForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("registerName").value.trim();
  const email = $("registerEmail").value.trim().toLowerCase();
  const password = $("registerPassword").value;
  const confirmPassword = $("confirmPassword").value;

  if (password.length < 6) {
    $("registerMessage").textContent =
      "Password must contain at least 6 characters.";
    return;
  }

  if (password !== confirmPassword) {
    $("registerMessage").textContent = "Passwords do not match.";
    return;
  }

  const accounts = getAccounts();

  if (accounts.some((account) => account.email === email)) {
    $("registerMessage").textContent =
      "An account with this email already exists.";
    return;
  }

  accounts.push({ name, email, password });
  saveAccounts(accounts);

  $("registerMessage").style.color = "green";
  $("registerMessage").textContent =
    "Account created! You can now log in.";

  $("registerForm").reset();

  setTimeout(() => {
    switchAuthTab("login");
    $("loginEmail").value = email;
  }, 900);
});

$("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const email = $("loginEmail").value.trim().toLowerCase();
  const password = $("loginPassword").value;

  if (!email || !email.includes("@") || !email.includes(".")) {
    $("loginMessage").textContent = "Please enter a valid email address.";
    return;
  }

  if (password.length < 6) {
    $("loginMessage").textContent =
      "Password must contain at least 6 characters.";
    return;
  }

  const accounts = getAccounts();

  const existingUser = accounts.find(
    (account) => account.email === email
  );

  const user = existingUser
    ? { name: existingUser.name, email: existingUser.email }
    : {
        name: email.split("@")[0],
        email: email
      };

  sessionStorage.setItem(
    "wol_current_user",
    JSON.stringify(user)
  );

  $("loginForm").reset();
  $("loginMessage").textContent = "";

  showApplication(user);
});

$("logoutButton").addEventListener("click", () => {
  sessionStorage.removeItem("wol_current_user");
  showLogin();
  switchAuthTab("login");
});

$("homeButton").addEventListener("click", (event) => {
  event.preventDefault();
  showView("reader");
});

/* ---------- INITIALIZE APPLICATION ---------- */

function initializeApplication() {
  renderBookList();
  populateBookSelect();
  populateChapterSelect();
  loadDailyVerse();
  showView("reader");

  if (!currentPassage) {
    loadPassage("Genesis 1");
  }
}

/* ---------- BOOK LIST ---------- */

function renderBookList() {
  const search = $("bookSearch").value.toLowerCase();

  const filteredBooks = bibleBooks.filter((book) => {
    const matchesSearch = book.name.toLowerCase().includes(search);
    const matchesTestament =
      currentTestament === "all" ||
      book.testament === currentTestament;

    return matchesSearch && matchesTestament;
  });

  $("bookList").innerHTML = "";

  filteredBooks.forEach((book) => {
    const button = document.createElement("button");
    button.className = "book-item";

    if (book.name === selectedBook) {
      button.classList.add("active");
    }

    const name = document.createElement("span");
    name.textContent = book.name;

    const count = document.createElement("span");
    count.className = "book-count";
    count.textContent = `${book.chapters} ch.`;

    button.append(name, count);

    button.addEventListener("click", () => {
      selectedBook = book.name;
      selectedChapter = 1;

      $("bookSelect").value = selectedBook;
      populateChapterSelect();
      renderBookList();

      loadPassage(`${selectedBook} 1`);
      showView("reader");
    });

    $("bookList").appendChild(button);
  });

  if (filteredBooks.length === 0) {
    const message = document.createElement("p");
    message.className = "no-favorites";
    message.textContent = "No matching Bible book found.";
    $("bookList").appendChild(message);
  }
}

$("bookSearch").addEventListener("input", renderBookList);

document.querySelectorAll(".testament-btn").forEach((button) => {
  button.addEventListener("click", () => {
    currentTestament = button.dataset.testament;

    document.querySelectorAll(".testament-btn").forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    renderBookList();
  });
});

/* ---------- BOOK AND CHAPTER SELECTORS ---------- */

function populateBookSelect() {
  $("bookSelect").innerHTML = "";

  bibleBooks.forEach((book) => {
    const option = document.createElement("option");
    option.value = book.name;
    option.textContent = book.name;
    $("bookSelect").appendChild(option);
  });

  $("bookSelect").value = selectedBook;
}

function populateChapterSelect() {
  const book = bibleBooks.find((item) => item.name === selectedBook);

  $("chapterSelect").innerHTML = "";

  if (!book) return;

  for (let chapter = 1; chapter <= book.chapters; chapter++) {
    const option = document.createElement("option");
    option.value = chapter;
    option.textContent = `Chapter ${chapter}`;
    $("chapterSelect").appendChild(option);
  }

  $("chapterSelect").value = selectedChapter;
}

$("bookSelect").addEventListener("change", () => {
  selectedBook = $("bookSelect").value;
  selectedChapter = 1;

  populateChapterSelect();
  renderBookList();
});

$("chapterSelect").addEventListener("change", () => {
  selectedChapter = Number($("chapterSelect").value);
});

$("readChapterButton").addEventListener("click", () => {
  const reference = `${selectedBook} ${selectedChapter}`;
  loadPassage(reference);
  showView("reader");
});

/* ---------- BIBLE REFERENCE SEARCH ---------- */

$("referenceForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const reference = $("referenceInput").value.trim();

  if (!reference) return;

  loadPassage(reference);
  showView("reader");
});

/* ---------- FETCH BIBLE PASSAGE ---------- */

async function loadPassage(reference) {
  const translation = $("translationSelect").value;

  $("loadingMessage").classList.remove("hidden");
  $("errorMessage").classList.add("hidden");
  $("verseContainer").innerHTML = "";
  $("searchButton").disabled = true;
  $("readChapterButton").disabled = true;
  $("favoritePassageButton").disabled = true;

  try {
    const url =
      `${API_URL}${encodeURIComponent(reference)}` +
      `?translation=${encodeURIComponent(translation)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        "Passage not found. Check the book, chapter, and verse reference."
      );
    }

    const data = await response.json();

    if (!data.verses || data.verses.length === 0) {
      throw new Error("No verses were returned for this passage.");
    }

    currentPassage = {
      reference: data.reference || reference,
      text: data.text || "",
      verses: data.verses,
      translation: translation
    };

    displayPassage(currentPassage);
    updateNavigation(reference);
    updateSelectedBook(reference);

    $("favoritePassageButton").disabled = false;
  } catch (error) {
    $("errorMessage").textContent =
      error.message ||
      "Unable to retrieve the passage. Please check your internet connection.";
    $("errorMessage").classList.remove("hidden");

    $("passageTitle").textContent = "Unable to Load Passage";
    $("passageSubtitle").textContent = "Please check your reference and try again.";
  } finally {
    $("loadingMessage").classList.add("hidden");
    $("searchButton").disabled = false;
    $("readChapterButton").disabled = false;
  }
}

/* ---------- DISPLAY VERSES ---------- */

function displayPassage(passage) {
  $("passageTitle").textContent = passage.reference;
  $("passageSubtitle").textContent =
    `Translation: ${passage.translation.toUpperCase()} • ` +
    `${passage.verses.length} verse(s)`;

  $("verseContainer").innerHTML = "";

  passage.verses.forEach((verse) => {
    const verseRow = document.createElement("div");
    verseRow.className = "verse-item";

    const number = document.createElement("span");
    number.className = "verse-number";
    number.textContent = verse.verse;

    const text = document.createElement("p");
    text.className = "verse-text";
    text.textContent = verse.text.trim();

    verseRow.append(number, text);
    $("verseContainer").appendChild(verseRow);
  });

  $("favoritePassageButton").textContent = "♡ Save Passage";
}

/* ---------- IDENTIFY BOOK AND CHAPTER ---------- */

function updateSelectedBook(reference) {
  const match = reference.match(/^(.+?)\s+(\d+)/);

  if (!match) return;

  const possibleBook = match[1].trim();
  const chapter = Number(match[2]);

  const book = bibleBooks.find(
    (item) => item.name.toLowerCase() === possibleBook.toLowerCase()
  );

  if (!book) return;

  selectedBook = book.name;
  selectedChapter = chapter;

  $("bookSelect").value = selectedBook;
  populateChapterSelect();
  $("chapterSelect").value = selectedChapter;

  renderBookList();
}

/* ---------- CHAPTER NAVIGATION ---------- */

function updateNavigation(reference) {
  const match = reference.match(/^(.+?)\s+(\d+)/);

  if (!match) {
    $("previousChapterButton").disabled = true;
    $("nextChapterButton").disabled = true;
    return;
  }

  const bookName = match[1].trim();
  const chapter = Number(match[2]);

  const bookIndex = bibleBooks.findIndex(
    (book) => book.name.toLowerCase() === bookName.toLowerCase()
  );

  if (bookIndex === -1) return;

  const book = bibleBooks[bookIndex];

  $("previousChapterButton").disabled =
    bookIndex === 0 && chapter === 1;

  $("nextChapterButton").disabled =
    bookIndex === bibleBooks.length - 1 &&
    chapter === book.chapters;
}

$("previousChapterButton").addEventListener("click", () => {
  const bookIndex = bibleBooks.findIndex(
    (book) => book.name === selectedBook
  );

  if (selectedChapter > 1) {
    selectedChapter--;
  } else if (bookIndex > 0) {
    selectedBook = bibleBooks[bookIndex - 1].name;
    selectedChapter = bibleBooks[bookIndex - 1].chapters;
  } else {
    return;
  }

  $("bookSelect").value = selectedBook;
  populateChapterSelect();
  $("chapterSelect").value = selectedChapter;

  renderBookList();
  loadPassage(`${selectedBook} ${selectedChapter}`);
});

$("nextChapterButton").addEventListener("click", () => {
  const bookIndex = bibleBooks.findIndex(
    (book) => book.name === selectedBook
  );

  const currentBook = bibleBooks[bookIndex];

  if (selectedChapter < currentBook.chapters) {
    selectedChapter++;
  } else if (bookIndex < bibleBooks.length - 1) {
    selectedBook = bibleBooks[bookIndex + 1].name;
    selectedChapter = 1;
  } else {
    return;
  }

  $("bookSelect").value = selectedBook;
  populateChapterSelect();
  $("chapterSelect").value = selectedChapter;

  renderBookList();
  loadPassage(`${selectedBook} ${selectedChapter}`);
});

/* ---------- TRANSLATION CHANGE ---------- */

$("translationSelect").addEventListener("change", () => {
  if (currentPassage) {
    loadPassage(currentPassage.reference);
  }
});

/* ---------- FAVORITES ---------- */

function getFavorites() {
  return JSON.parse(localStorage.getItem("wol_favorites") || "[]");
}

function saveFavorites(favorites) {
  localStorage.setItem("wol_favorites", JSON.stringify(favorites));
}

$("favoritePassageButton").addEventListener("click", () => {
  if (!currentPassage) return;

  const favorites = getFavorites();

  const alreadySaved = favorites.some(
    (item) =>
      item.reference === currentPassage.reference &&
      item.translation === currentPassage.translation
  );

  if (alreadySaved) {
    $("favoritePassageButton").textContent = "♡ Already Saved";
    return;
  }

  favorites.push({
    reference: currentPassage.reference,
    text: currentPassage.text,
    verses: currentPassage.verses,
    translation: currentPassage.translation
  });

  saveFavorites(favorites);

  $("favoritePassageButton").textContent = "♥ Saved!";
});

function renderFavorites() {
  const favorites = getFavorites();
  $("favoritesList").innerHTML = "";

  if (favorites.length === 0) {
    $("favoritesList").innerHTML =
      '<p class="no-favorites">You have not saved any passages yet.</p>';
    return;
  }

  favorites.forEach((favorite, index) => {
    const card = document.createElement("div");
    card.className = "favorite-card";

    const reference = document.createElement("strong");
    reference.textContent =
      `${favorite.reference} (${favorite.translation.toUpperCase()})`;

    const verseText = document.createElement("p");
    verseText.textContent = favorite.text;

    const actions = document.createElement("div");
    actions.className = "favorite-actions";

    const openButton = document.createElement("button");
    openButton.textContent = "Read Passage";
    openButton.addEventListener("click", () => {
      $("translationSelect").value = favorite.translation;
      loadPassage(favorite.reference);
      showView("reader");
    });

    const removeButton = document.createElement("button");
    removeButton.className = "remove-favorite";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      const updated = getFavorites();
      updated.splice(index, 1);
      saveFavorites(updated);
      renderFavorites();
    });

    actions.append(openButton, removeButton);
    card.append(reference, verseText, actions);
    $("favoritesList").appendChild(card);
  });
}

/* ---------- VIEW NAVIGATION ---------- */

function showView(view) {
  currentView = view;

  $("readerView").classList.toggle("hidden", view !== "reader");
  $("favoritesView").classList.toggle("hidden", view !== "favorites");

  document.querySelectorAll(".side-link").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  if (view === "favorites") {
    renderFavorites();
  }
}

document.querySelectorAll(".side-link").forEach((button) => {
  button.addEventListener("click", () => {
    showView(button.dataset.view);
  });
});

/* ---------- DAILY VERSE ---------- */

const dailyVerses = [
  {
    reference: "Genesis 1:1",
    text: "In the beginning God created the heavens and the earth."
  },
  {
    reference: "Psalm 23:1",
    text: "The LORD is my shepherd; I shall not want."
  },
  {
    reference: "Proverbs 3:5",
    text: "Trust in the LORD with all your heart, and don't lean on your own understanding."
  },
  {
    reference: "Isaiah 41:10",
    text: "Don't you be afraid, for I am with you. Don't be dismayed, for I am your God."
  },
  {
    reference: "Matthew 5:16",
    text: "Even so, let your light shine before men."
  },
  {
    reference: "John 3:16",
    text: "For God so loved the world, that he gave his one and only Son."
  },
  {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ, who strengthens me."
  }
];

function loadDailyVerse() {
  const day = Math.floor(Date.now() / 86400000);
  const verse = dailyVerses[day % dailyVerses.length];

  $("dailyVerseText").textContent = verse.text;
  $("dailyVerseReference").textContent = verse.reference;
}

/* ---------- APPLICATION START ---------- */

document.addEventListener("DOMContentLoaded", () => {
  const activeUser = sessionStorage.getItem("wol_current_user");

  if (activeUser) {
    try {
      showApplication(JSON.parse(activeUser));
    } catch {
      sessionStorage.removeItem("wol_current_user");
      showLogin();
    }
  } else {
    showLogin();
  }
});
