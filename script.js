document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const buttons = form.querySelectorAll("button");

    buttons[0].addEventListener("click", function (e) {
        e.preventDefault();
        const password = document.getElementById("password").value;
        const result = getPasswordStrengthV1(password);
        showResult(result, "bar", "feedback1");
    });

    buttons[1].addEventListener("click", function (e) {
        e.preventDefault();
        const password = document.getElementById("password").value;
        const result = getPasswordStrengthV2(password);
        showResult(result, "bar2", "feedback2");
    });
});

// V1
function getPasswordStrengthV1(password) {
    if (!password)
        return { message: "Please enter password", color: "blue", percent: 0 };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const feedbackOptions = [
        { message: "Very Weak", color: "red", percent: 20 },
        { message: "Weak", color: "orangered", percent: 40 },
        { message: "Moderate", color: "orange", percent: 60 },
        { message: "Strong", color: "green", percent: 80 },
        { message: "Very Strong", color: "darkgreen", percent: 100 }
    ];

    return feedbackOptions[Math.min(score, feedbackOptions.length - 1)];
}

// V2
function getPasswordStrengthV2(password) {
    if (!password)
        return { message: "Please enter password", color: "blue", percent: 0 };

    const result = zxcvbn(password);
    const score = result.score; // 0 to 4
    const colorMap = ["red", "orangered", "orange", "green", "darkgreen"];
    const messageMap = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];

    const message = result.feedback.warning || messageMap[score];
    return {
        message: `${message} <br>Estimated crack time: ${result.crack_times_display.offline_slow_hashing_1e4_per_second}`,
        color: colorMap[score],
        percent: (score + 1) * 20
    };
}

function showResult(result, barId, feedbackId) {
    const bar = document.getElementById(barId);
    const feedback = document.getElementById(feedbackId);

    bar.style.width = `${result.percent}%`;
    bar.style.backgroundColor = result.color;

    feedback.innerHTML = `<p style="color: ${result.color}; font-weight: bold;">${result.message}</p>`;
}
