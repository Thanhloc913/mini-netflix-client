import z from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
});

export const RegisterSchema = z.object({
  username: z.string().min(1, "Required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatarURL: z.string().min(1, "Required"),
  email: z.string().min(1, "Required").email("Invalid email"),
});

export type loginType = z.infer<typeof LoginSchema>;
export type registerRequest = z.infer<typeof RegisterSchema>;