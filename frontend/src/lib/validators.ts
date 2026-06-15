import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
    universityId: z.string().min(1, "Choose your university"),
    role: z.enum(["WORKER", "POSTER"]),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const postGigStep1 = z.object({
  title: z.string().min(5, "Title too short").max(100),
  category: z.enum([
    "Tutoring",
    "Errands",
    "Tech help",
    "Events",
    "Creative",
    "Delivery",
    "Translation",
    "Photography",
    "Other",
  ]),
  description: z.string().min(20, "Describe the gig in at least 20 characters").max(2000),
  location: z.string().min(2),
  remote: z.boolean().optional(),
});
export const postGigStep2 = z.object({
  universityId: z.string().min(1, "Choose a university"),
  budget: z.coerce.number().min(500, "Min XAF 500"),
  slots: z.coerce.number().min(1).max(10),
  deadline: z.string().min(1, "Pick a deadline"),
  isEasyApply: z.boolean(),
});
export type PostGigStep1 = z.infer<typeof postGigStep1>;
export type PostGigStep2 = z.infer<typeof postGigStep2>;

export const editProfileSchema = z.object({
  fullName: z.string().min(2),
  bio: z.string().max(300).optional(),
  universityId: z.string().min(1),
  skills: z.array(z.string()).max(10),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});
export type EditProfileInput = z.infer<typeof editProfileSchema>;
