// tests/api.spec.ts
import {test, expect} from '@playwright/test';
import {StatusCodes} from "http-status-codes";
import {clearAllUsers, createTwoUsers, getAllUserIds} from "./helpers";


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
        const response = await request.post(`${baseURL}`);
        const responseBody = await response.json()
        const userId = responseBody.id;
        console.log(userId)
        const responseBody1 = await request.delete(`${baseURL}/${userId}/+1`);
        expect(responseBody1.status()).toBe(StatusCodes.NOT_FOUND);
    });
});

test.describe('User management API 2', () => {
    let userIds: string[] = []; // to be used in both tests
    test.beforeEach(async ({request}) => {
        await clearAllUsers(request, baseURL);
        await createTwoUsers(request, baseURL);
        userIds = await getAllUserIds(request, baseURL);
    });

    test('Delete all users ID  after getting their information', async ({request}) => {
        for (let i = 0; i < userIds.length; i++) {
            let deletedResponse = await request.delete(`${baseURL}/${userIds[i]}`);
            expect(deletedResponse.status()).toBe(StatusCodes.OK);
        }
        console.log(userIds);
        const responseAfterDelete = await request.get(`${baseURL}`);
        const usersAfterDelete = await responseAfterDelete.json();
        expect(usersAfterDelete.length).toBe(0);
        const usersAfterDelete1 = await responseAfterDelete.text();
        expect(usersAfterDelete1).toBe('[]');
    });

    test('Delete all users ID except last user', async ({request}) => {
        for (let i = 0; i < userIds.length - 1; i++) {
            let deletedResponse = await request.delete(`${baseURL}/${userIds[i]}`);
            expect(deletedResponse.status()).toBe(StatusCodes.OK);
        }
        console.log(userIds);
        const responseAfterDelete = await request.get(`${baseURL}`);
        const usersAfterDelete = await responseAfterDelete.json();
        expect(usersAfterDelete.length).toBe(1);
    });
});
