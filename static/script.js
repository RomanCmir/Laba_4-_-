const apiBaseUrl = 'http://localhost:8000';
let access_token;

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    let username = document.getElementById('login').value;
    let password = document.getElementById('password').value;

    const response = await fetch(`${apiBaseUrl}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&grant_type=password`,
    });

    if (!response.ok) {
        alert("Ошибка при авторизации");
        return;
    }

    const token = await response.json();
    access_token = token.access_token;
    fetchUsers();
});

async function fetchUsers() {
    if (!access_token) {
        alert("Пользователь не авторизован");
        return;
    }

    const response = await fetch(`${apiBaseUrl}/users/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!response.ok) {
        alert("Ошибка при получении списка пользователей");
        return;
    }

    const users = await response.json();
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.textContent = `${user.id}: ${user.username} (${user.email})`;
        userList.appendChild(li);
    });
}

document.getElementById('create-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const full_name = document.getElementById('full_name').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${apiBaseUrl}/register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, full_name, password }),
    });

    if (response.ok) {
        alert('Юзер создан!');
        fetchUsers();
    } else {
        alert('Ошибка создания юзера!');
    }
});

document.getElementById('update-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('update-user-id').value;
    const username = document.getElementById('update-username').value;
    const email = document.getElementById('update-email').value;
    const full_name = document.getElementById('update-full_name').value;
    const password = document.getElementById('update-password').value;

    const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ username, email, full_name, password }),
    });

    if (response.ok) {
        alert('Юзер обновлён!');
        fetchUsers();
    } else {
        alert('Ошибка обновления юзера!');
    }
});

document.getElementById('users-me-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const response = await fetch(`${apiBaseUrl}/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (response.ok) {
        alert('Пользователь успешно получил информацию!');
        const info = await response.json();
        console.log(info);
        const userInfoDiv = document.getElementById('user-info');
        userInfoDiv.innerHTML = '';
        for (const [key, value] of Object.entries(info)) {
            const p = document.createElement('p');
            p.textContent = `${key}: ${value}`;
            userInfoDiv.appendChild(p);
        }
        fetchUsers();
    } else {
        alert('Ошибка при получении информации о пользователе!');
    }
});

document.getElementById('delete-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('delete-user-id').value;

    const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (response.ok) {
        alert('Пользователь удалён успешно!');
        fetchUsers();
    } else {
        alert('Ошибка при удалении пользователя');
    }
});