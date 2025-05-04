
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

function randomImage(){

    const images = [
        'images/Flask1.jpg',
        'images/Infared_1HourExposure_GreenPepper_ copy.jpg',
        'images/MountainsEdit copy.jpg'
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    document.getElementById('random-image').src = randomImage;
}