// Inisialisasi Google Auth
function initGoogleAuth() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: 'YOUR_GOOGLE_CLIENT_ID', // Ganti dengan ID klien Google Anda
        });
        
        renderAuthButton();
    });
}

// Render tombol otentikasi Google
function renderAuthButton() {
    gapi.signin2.render('auth-button', {
        'scope': 'profile email',
        'width': 200,
        'height': 40,
        'longtitle': false,
        'theme': 'light',
        'onsuccess': onSignIn,
        'onfailure': onFailure,
    });
}

// Fungsi ketika otentikasi berhasil
function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    const authStatus = document.getElementById('auth-status');
    authStatus.textContent = `Logged in as: ${profile.getName()}`;
    
    const signOutButton = document.createElement('button');
    signOutButton.setAttribute('id', 'sign-out-button');
    signOutButton.textContent = 'Sign Out';
    signOutButton.addEventListener('click', signOut);
    document.getElementById('auth-container').appendChild(signOutButton);

    // Implementasikan logic untuk mengambil dan menampilkan daftar todos
    fetchTodos();
}

// Fungsi ketika otentikasi gagal
function onFailure(error) {
    console.error(error);
}

// Fungsi untuk keluar (sign out)
function signOut() {
    const authStatus = document.getElementById('auth-status');
    authStatus.textContent = '';

    const authButtonContainer = document.getElementById('auth-button');
    authButtonContainer.innerHTML = '';

    const todoContainer = document.getElementById('todo-container');
    todoContainer.innerHTML = '';

    const signOutButton = document.getElementById('sign-out-button');
    signOutButton.style.display = 'none';

    // Sign out dari Google Auth
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut();
}

// Fungsi untuk mengambil dan menampilkan daftar todos
function fetchTodos() {
     // Mengambil token JWT dari Google Auth
     const auth2 = gapi.auth2.getAuthInstance();
     const googleUser = auth2.currentUser.get();
     const idToken = googleUser.getAuthResponse().id_token;
 
     // Fetch daftar todos dari backend API
     fetch('https://api.example.com/todos', {
         method: 'GET',
         headers: {
             'Authorization': `Bearer ${idToken}`, // Menggunakan JWT token dari Google Auth
         },
     })
     .then(response => response.json())
     .then(data => {
        console.log('Data todos:', data);
        renderTodos(data);
     })
     .catch(error => console.error('Error fetching todos:', error));
     const dummyData = [
        { id: 1, title: 'Task 1', description: 'Description for Task 1' },
        { id: 2, title: 'Task 2', description: 'Description for Task 2' },
        { id: 3, title: 'Task 3', description: 'Description for Task 3' },
    ];

    renderTodos(dummyData);
    }
 

// Fungsi untuk merender daftar todos
function renderTodos(todos) {
    const todoTable = document.getElementById('todo-table');
    const todoContainer = document.getElementById('todo-list');
    todoContainer.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('todo-table');

    const headerRow = table.createTHead().insertRow(0);
    headerRow.innerHTML = '<th>Title</th><th>Description</th>';

    todos.forEach(todo => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${todo.title}</td><td>${todo.description}</td>`;
        todoList.appendChild(row);
    });
}

const addTodoRow = document.createElement('tr');
    addTodoRow.innerHTML = `
        <td><input type="text" id="new-todo-title" placeholder="New Task Title"></td>
        <td><input type="text" id="new-todo-description" placeholder="New Task Description"></td>
    `;
    todoList.appendChild(addTodoRow);

    const addButtonCell = document.createElement('td');
    addButtonCell.colSpan = 2;
    addButtonCell.innerHTML = '<button onclick="addNewTodo()">Add New Task</button>';
    addTodoRow.appendChild(addButtonCell);
    function addNewTodo() {
        const newTodoTitle = document.getElementById('new-todo-title').value;
        const newTodoDescription = document.getElementById('new-todo-description').value;
        const newTodo = { title: newTodoTitle, description: newTodoDescription };
    console.log('New Todo:', newTodo);

    // Setelah berhasil menambahkan, panggil kembali fetchTodos untuk merender ulang daftar todos
    fetchTodos();
}

    todoContainer.appendChild(table);


    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
        todoItem.innerHTML = `
            <strong>${todo.title}</strong>
            <p>${todo.description}</p>
        `;

        todoContainer.appendChild(todoItem);
    });

// Panggil fungsi inisialisasi Google Auth saat halaman dimuat
document.addEventListener('DOMContentLoaded', initGoogleAuth);
