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
        const response = await request.post(`${baseURL}`);
        const responseBody = await response.json()
        const userId = responseBody.id;
        console.log(userId)
        const responseBody1 = await request.delete(`${baseURL}/${userId}/+1`);
        expect(responseBody1.status()).toBe(StatusCodes.NOT_FOUND);
    });
});

test.describe('User management API 2', () => {
    let userIDs: string[] = [];
    test.beforeEach(async ({request}) => {
        userIDs = [];// for clearing old ID before each test
        const response = await request.post(`${baseURL}`);
        const response1 = await request.post(`${baseURL}`);
        const responseAllUsers = await request.get(`${baseURL}`);
        const responseUsers = await responseAllUsers.json()
        const numberOfobjects = responseUsers.length;
        console.log('number of users ' + numberOfobjects);
        for (let i = 0; i < numberOfobjects; i++) {
            let userID = responseUsers[i].id;
            userIDs.push(userID);
        }
    });
    test('Delete all users ID  after getting their information', async ({request}) => {
        for (let i = 0; i < userIDs.length; i++) {
            let deletedresponse = await request.delete(`${baseURL}/${userIDs[i]}`);
            expect(deletedresponse.status()).toBe(StatusCodes.OK);
        }
        console.log(userIDs);
        const responseAfterDelete = await request.get(`${baseURL}`);
        const usersAfterDelete = await responseAfterDelete.json();
        expect(usersAfterDelete.length).toBe(0);
    });
    test('Delete all users ID except last user', async ({request}) => {
        for (let i = 0; i < userIDs.length - 1; i++) {
            let deletedresponse = await request.delete(`${baseURL}/${userIDs[i]}`);
            expect(deletedresponse.status()).toBe(StatusCodes.OK);
        }
        console.log(userIDs);
        const responseAfterDelete = await request.get(`${baseURL}`);
        const usersAfterDelete = await responseAfterDelete.json();
        expect(usersAfterDelete.length).toBe(1);
    });
});
