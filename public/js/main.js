
const { database } = require('../database.js');

function loadForm(type) {
    fetch(`/form/${type}`)
        .then(res => res.text())
        .then(html => {
            document.getElementById('form-container').innerHTML = html;
        });
}

function invalidMessage(type) {
    const errorMessage = document.getElementById('invalid');
    errorMessage.innerHTML = `Invalid ${type}`;
}

function randomImage() {

    const images = [
        'images/Flask1.jpg',
        'images/Infared_1HourExposure_GreenPepper_ copy.jpg',
        'images/MountainsEdit copy.jpg'
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    document.getElementById('random-image').src = randomImage;
}

// Promote user
function promoteUser(email) {
    fetch("/admin/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    })
        .then((res) => {
            if (res.ok) {
                res.session.type = "admin";
                alert("User promoted to admin!");
                location.reload();
            } else {
                alert("Failed to promote user.");
            }
        })
        .catch((err) => console.error("Error:", err));
}

// Demote user
function demoteUser(email) {
    fetch("/admin/demote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    })
        .then((res) => {
            if (res.ok) {
                alert("User demoted.");
                location.reload();
            } else {
                alert("Failed to demote user.");
            }
        })
        .catch((err) => console.error("Error:", err));
}
