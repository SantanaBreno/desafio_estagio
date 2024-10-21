const apiLoginUrl = 'http://localhost:8000/token'; // URL do endpoint de autenticação

function login(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', apiLoginUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            localStorage.setItem('token', data.access_token); // Armazena o token no local storage
            window.location.href = 'tasks.html'; // Redireciona para a tela de tarefas
        } else {
            const message = document.getElementById('message');
            message.textContent = 'Erro ao autenticar: ' + xhr.statusText;
        }
    };

    xhr.onerror = function() {
        console.error('Request failed');
    };

    // Envia o username e a password para a API
    xhr.send(`username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
}
