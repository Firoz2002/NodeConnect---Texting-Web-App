export const getUsers = (users: any) => {
    const onlineUsers:any = [];
    users.forEach((user: any) => {
        onlineUsers.push(Object.values(user)[0]);
    });
    return onlineUsers;
};

module.exports = { getUsers };