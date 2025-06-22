import { getAll, create, getById, remove, update } from '../models/user.model.js';

const getUsers = async () => {
   try {
      return await getAll();
   } catch (error) {
      console.error('Error reading database:', error);
      return [];
   }
};

const getUserById = async (userId) => {
   const findUserId = Number(userId);
   try {
      const user = await getById(findUserId);
      if (!user) {
         const error = new Error('User not found');
         error.status = 404;
         throw error;
      }

      return user;
   } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
   }
};

const createUser = async (userData) => {
   if (!userData.name || !userData.email) {
      const error = new Error('Name and email are required');
      error.status = 400;
      throw error;
   }

   const users = await getUsers();

   const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

   const newUser = {
      id: newId,
      name: userData.name,
      email: userData.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
   };

   await create(newUser);

   return newUser;
};

const updateUser = async (userId, userData) => {
   try {
      if (!userData.name || !userData.email) {
         const error = new Error('Name and email are required');
         error.status = 400;
         throw error;
      }

      const user = await getUserById(userId);
      const updatedUser = {
         ...user,
         ...userData,
         updatedAt: new Date().toISOString(),
      };

      await update(userId, updatedUser);

      return updatedUser;
   } catch (error) {
      console.error('Error updating user:', error);
      throw error;
   }
};

const removeUser = async (userId) => {
   const removedUserId = Number(userId);
   try {
      await remove(removedUserId);
      return removedUserId;
   } catch (error) {
      console.error('Error removing user by ID:', error);
      return null;
   }
};

export { getUsers, getUserById, createUser, updateUser, removeUser };
