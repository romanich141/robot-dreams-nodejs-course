import { getUsers, createUser } from '../../services/user.service.js';

export const GET = async () => {
   const users = await getUsers();

   return users;
};

export const POST = async (req, res) => {
   const user = await createUser(req.body);
   res.statusCode = 201;

   return user;
};
