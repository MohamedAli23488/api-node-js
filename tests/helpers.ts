export async function clearAllUsers(request: any, baseURL: string) {
    const responseAll = await request.get(`${baseURL}`);
    const users = await responseAll.json();
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        await request.delete(`${baseURL}/${user.id}`);
    }
}

export async function createTwoUsers(request: any, baseURL: string) {
    await request.post(`${baseURL}`);
    await request.post(`${baseURL}`);
}

export async function getAllUserIds(request: any, baseURL: string): Promise<string[]> {
    const responseAllUsers = await request.get(`${baseURL}`);
    const responseUsers = await responseAllUsers.json();
    const userIds: string[] = [];
    for (let i = 0; i < responseUsers.length; i++) {
        userIds.push(responseUsers[i].id);
    }
    return userIds;
}