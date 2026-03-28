import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { mockDatabase } from '../../../database/models';

export const getAllUsersProcedure = publicProcedure
  .query(async () => {
    console.log('Getting all users');
    
    const users = await mockDatabase.getAllUsers();
    
    return {
      success: true,
      users,
    };
  });

export const searchUsersProcedure = publicProcedure
  .input(z.object({
    query: z.string(),
  }))
  .query(async ({ input }) => {
    console.log('Searching users with query:', input.query);
    
    const users = await mockDatabase.searchUsers(input.query);
    
    return {
      success: true,
      users,
    };
  });