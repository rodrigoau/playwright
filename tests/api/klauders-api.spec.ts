import { test, expect } from '@playwright/test';

const API_URL = 'https://klauders.com/automate-the-internet';

const credentials = {
    username: 'qa.engineer',
    password: 'Klauders#2026',
};

test.describe('API - auth/login', () => {
    test('login con credenciales válidas devuelve token y usuario', async ({ request }) => {
        const response = await request.post(API_URL, {
            params: { api: 'auth/login' },
            data: credentials,
        });

        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');

        const body = await response.json();

        expect(body.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
        expect(body.expiresIn).toBe(3600);
        expect(body.user).toEqual({
            id: 7,
            username: 'qa.engineer',
            name: 'QA Engineer',
            role: 'QA Engineer',
        });
        expect(body.requestId).toMatch(/^req_[a-f0-9]+$/);
        expect(body.requestId).toBe(response.headers()['x-request-id']);
    });

    test('login con contraseña incorrecta devuelve 401', async ({ request }) => {
        const response = await request.post(API_URL, {
            params: { api: 'auth/login' },
            data: { ...credentials, password: 'incorrecta' },
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.error).toBe('invalid_credentials');
        expect(body.message).toBe('Invalid username or password.');
        expect(body).not.toHaveProperty('token');
    });
});
