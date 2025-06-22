import { createUser, removeUser, updateUser, getUserById } from '../../../services/user.service.js';

export const GET = async (req) => {
   const userId = req.params.id;
   const user = await getUserById(userId);

   return user;
};

export const POST = async (req, res) => {
   const user = await createUser(req.body);
   res.statusCode = 201;

   return user;
};

export const DELETE = async (req, res) => {
   const userId = req.params.id;
   const removedUserId = await removeUser(userId);

   if (!removedUserId) {
      res.statusCode = 404;
      return { error: 'User not found' };
   }

   res.statusCode = 200;
   return removedUserId;
};

export const PUT = async (req, res) => {
   const userId = req.params.id;
   const userData = req.body;

   try {
      const updatedUser = await updateUser(Number(userId), userData);
      return updatedUser;
   } catch (error) {
      res.statusCode = error.status || 500;
      return { error: error.message || 'Internal Server Error' };
   }
};
