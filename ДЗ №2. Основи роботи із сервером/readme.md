# Folder-based Router для Node.js (ES Modules)

## 📁 Структура проекту

```
├── routes/
│   └── users/
│       ├── route.js           # export GET, POST
│       └── [id]/
│           └── route.js       # export GET, PUT, DELETE
├── services/
│   └── users.service.js       # export default UsersService
├── lib/
│   └── router.js              # export router function
├── tests/
│   └── users.test.js          # tests
├── database.json              # JSON база даних
├── index.js                   # Entry point
└── package.json               # "type": "module"
```

## Встановлення

1. Клонуйте репозиторій:
   ```sh
   git clone https://github.com/romanich141/robot-dreams-nodejs-course
   cd "ДЗ №1. Node.js: архітектура, завдання та основні концепції"
   ```
2. Встановіть залежності:

   ```sh
   npm install
   ```

3. Створіть файл `.env` на основі [.env.example](ДЗ №2. Основи роботи із сервером/.env.example):
   ```
   PORT=3000
   NODE_ENV=development
   ```

## 📡 API Endpoints

### Users

- `GET /users` - Отримати всіх користувачів
- `POST /users` - Створити нового користувача
- `GET /users/:id` - Отримати користувача за ID
- `PUT /users/:id` - Оновити користувача
- `DELETE /users/:id` - Видалити користувача

### Приклади запитів

```bash
# Отримати всіх користувачів
curl http://localhost:3000/users

# Створити користувача
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Отримати користувача за ID
curl http://localhost:3000/users/1

# Оновити користувача
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated"}'

# Видалити користувача
curl -X DELETE http://localhost:3000/users/1
```
