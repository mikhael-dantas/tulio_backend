import { z } from 'zod';

export const CreateUserDtoSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(20),
  isAdmin: z.boolean().optional(),
});

export const UpdateUserDtoSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  password: z.string().min(6).max(20).optional(),
  isAdmin: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
