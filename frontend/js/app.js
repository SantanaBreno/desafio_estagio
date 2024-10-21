const apiBaseUrl = 'http://localhost:8000/tasks';  // Alterar para o endpoint correto da sua API

// Função para listar todas as tarefas
function getTasks() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET',`${apiBaseUrl}/`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';

            data.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.className = 'task-item';
                taskItem.innerHTML = `
                    <span class="${task.status ? 'completa' : ''}">${task.title}</span>
                    <div class="task-actions">
                        <button onclick="toggleTask(${task.id}, ${task.status})">
                            ${task.status ? 'Completa' : 'Pendente'}
                        </button>
                        <button onclick="deleteTask(${task.id})">Deletar</button>
                    </div>
                `;
                taskList.appendChild(taskItem);
            });
        } else {
            console.error('Error fetching tasks:', xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error('Request failed');
    };
    xhr.send();
}

// Função para adicionar nova tarefa
function addTask() {
    const taskName = document.getElementById('taskName').value;

    if (taskName.trim() === '') {
        alert('Please enter a task name');
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${apiBaseUrl}/`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 201) {
            document.getElementById('taskName').value = '';
            getTasks();  // Atualizar lista de tarefas
        } else {
            console.error('Error adding task:', xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error('Request failed');
    };
    xhr.send(JSON.stringify({ title: taskName, description: 'test', status: false}));
}

// Função para alternar o status da tarefa (completa ou não)
function toggleTask(taskId, currentStatus) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `${apiBaseUrl}/${taskId}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            getTasks();  // Atualizar lista de tarefas
        } else {
            console.error('Error updating task:', xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error('Request failed');
    };
    xhr.send(JSON.stringify({ status: !currentStatus }));
}

// Função para remover uma tarefa
function deleteTask(taskId) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${apiBaseUrl}/${taskId}`, true);
    xhr.onload = function() {
        if (xhr.status === 204) {
            getTasks();  // Atualizar lista de tarefas
        } else {
            console.error('Error deleting task:', xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error('Request failed');
    };
    xhr.send();
}

// Carregar a lista de tarefas quando a página é carregada
document.addEventListener('DOMContentLoaded', getTasks);
