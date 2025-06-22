import { test, describe } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import {cfg} from '../config/index.js';

describe('Users API', () => {
    const baseUrl = `http://localhost:${cfg.port}`;

    const makeRequest = (method, path, body = null) => {
        return new Promise((resolve, reject) => {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(`${baseUrl}${path}`, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
            try {
                const parsed = JSON.parse(data);
                resolve({ status: res.statusCode, data: parsed });
            } catch {
                resolve({ status: res.statusCode, data: data });
            }
            });
        });

        req.on('error', reject);
        
        if (body) {
            req.write(JSON.stringify(body));
        }
        
        req.end();
        });
    }

    test('GET /users should return users list', async () => {
        const response = await makeRequest('GET', '/users');

        assert.strictEqual(response.status, 200);
        assert.ok(Array.isArray(response.data));
    });

    test('POST /users should create new user', async () => {
        const newUser = {
            name: 'Test User',
            email: 'test@example.com'
        };
        const response = await makeRequest('POST', '/users', newUser);

        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.name, newUser.name);
        assert.strictEqual(response.data.email, newUser.email);
    });

    test('GET /users/:id should return specific user', async () => {
        const response = await makeRequest('GET', '/users/1');

        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.id, 1);
    });

    test('PUT /users/:id should update specific user', async () => {
        const updatedUser = {
            name: 'Updated User',
            email: 'updated@example.com'
        };
        const response = await makeRequest('PUT', '/users/1', updatedUser);
        
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.name, updatedUser.name);
        assert.strictEqual(response.data.email, updatedUser.email);
    });

    test('DELETE /users/:id should return specific user', async () => {
        const response = await makeRequest('DELETE', '/users/1');
        
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data, 1);
    });
});