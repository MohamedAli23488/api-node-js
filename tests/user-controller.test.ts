// tests/api.spec.ts
import {test, expect} from '@playwright/test';
import {StatusCodes} from "http-status-codes";

let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API', () => {

    test('find user: should return a user by ID', async ({request}) => {
        // first create user
        const response = await request.post(`${baseURL}`);
        const responseBody = await response.json()
        const userId = responseBody.id;
        // Find user by id
        const responseUser = await request.get(baseURL + '/' + userId);
        expect(responseUser.status()).toBe(StatusCodes.OK);
    });

    test('find user: should return 404 if user not found', async ({request}) => {
        const userId = 147852;
        // Find user by id
        const responseUser = await request.get(`${baseURL}/${userId}`);
        expect(responseUser.status()).toBe(StatusCodes.NOT_FOUND);
    });

    test('create user: should add a new user', async ({request}) => {
        const response = await request.post(`${baseURL}`);
        expect(response.status()).toBe(StatusCodes.CREATED);
        const responseBody = await response.json()
        expect(responseBody).toBeDefined();
        console.log(responseBody);

    });

    test('delete user: should delete a user by ID', async ({request}) => {
        const response = await request.post(`${baseURL}`);
        expect(response.status()).toBe(StatusCodes.CREATED);
        const responseBody = await response.json()
        const userId = responseBody.id;
        const responseUser = await request.delete(`${baseURL}/${userId}`);
        expect(responseUser.status()).toBe(StatusCodes.OK);
        const deletedUser = await request.get(`${baseURL}/${userId}`);
        expect(deletedUser.status()).toBe(StatusCodes.NOT_FOUND);
    });

    test('delete user: should return 404 if user not found', async ({request}) => {
        const responseBody = await request.delete(`${baseURL}/190`);
        expect(responseBody.status()).toBe(StatusCodes.NOT_FOUND);

    });


});
