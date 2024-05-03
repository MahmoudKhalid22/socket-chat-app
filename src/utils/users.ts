export interface User {
  id: string | number;
  username: string;
  room: string;
}
const users: User[] = [];

// addUser, removeUser, getUser, getAllUsers

// ADD USER
const addUser = ({ id, username, room }: User): User | { error: string } => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "username and room are required",
    };
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });
  if (existingUser) {
    return {
      error: "username is in use",
    };
  }

  // STORE USER
  const user = { id, username, room };
  users.push(user);
  return user;
};

// REMOVE USER
const removeUser = (id: number | string) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

// GET USERS IN ROOM
const getUsers = (room: string) => {
  room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

// GET USER IN ROOM
const getUser = (id: number | string) => {
  return users.find((user: User) => user.id === id);
};

export { addUser, getUser, getUsers, removeUser };
