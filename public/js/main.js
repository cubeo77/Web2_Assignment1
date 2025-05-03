
function loadForm(type) {
    fetch(`/form/${type}`)
        .then(res => res.text())
        .then(html => {
            document.getElementById('form-container').innerHTML = html;
        });
}