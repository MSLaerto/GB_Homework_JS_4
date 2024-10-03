const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware для парсинга JSON
app.use(express.json());

// Функция для загрузки пользователей из файла
function loadUsers() {
    if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE);
        return JSON.parse(data);
    }
    return [];
}

// Функция для сохранения пользователей в файл
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Получение всех пользователей
app.get('/users', (req, res) => {
    const users = loadUsers();
    res.json(users);
});

// Получение пользователя по ID
app.get('/users/:id', (req, res) => {
    const users = loadUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json(user);
});

// Создание нового пользователя
app.post('/users', (req, res) => {
    const users = loadUsers();
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name: req.body.name,
        email: req.body.email,
    };
    
    users.push(newUser);
    saveUsers(users);
    
    res.status(201).json(newUser);
});

// Обновление пользователя по ID
app.put('/users/:id', (req, res) => {
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    users[userIndex] = {
        ...users[userIndex],
        name: req.body.name,
        email: req.body.email,
    };
    
    saveUsers(users);
    
    res.json(users[userIndex]);
});

// Удаление пользователя по ID
app.delete('/users/:id', (req, res) => {
    let users = loadUsers();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    users.splice(userIndex, 1);
    saveUsers(users);
    
    res.status(204).send();
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(Сервер запущен на http://localhost:${PORT});
});