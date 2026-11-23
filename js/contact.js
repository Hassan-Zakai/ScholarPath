(function () {

    const form = document.getElementById("feedback-form");
    if (!form) return;                              // only runs on the contact page

    const nameInput = document.getElementById("fb-name");
    const ratingInput = document.getElementById("fb-rating");
    const messageInput = document.getElementById("fb-message");
    const counter = document.getElementById("fb-count");
    const errorBox = document.getElementById("fb-error");
    const successBox = document.getElementById("fb-success");
    const STORAGE_KEY = "scholarpathFeedback";

    messageInput.addEventListener("input", function () {
        counter.textContent = messageInput.value.length + " / 500";
    });

    function showError(text) {
        errorBox.textContent = text;
        errorBox.hidden = false;
        successBox.hidden = true;
    }

    function saveFeedback(entry) {
        try {
            const old = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            old.push(entry);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(old));
        } catch (e) {
            console.warn("Could not save feedback:", e);
        }
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = nameInput.value.trim();
        const rating = ratingInput.value;
        const message = messageInput.value.trim();

        if (name === "") { showError("Please enter your name."); nameInput.focus(); return; }
        if (rating === "") { showError("Please choose a rating."); ratingInput.focus(); return; }
        if (message.length < 5) { showError("Please write a short feedback message."); messageInput.focus(); return; }

        saveFeedback({ name: name, rating: Number(rating), message: message, date: new Date().toISOString() });

        errorBox.hidden = true;
        successBox.hidden = false;
        form.reset();
        counter.textContent = "0 / 500";
    });

})();
