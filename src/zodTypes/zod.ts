import z from "zod";

const SignSchema = z.object({
  username: z
    .string()
    .nonempty()
    .min(5, "User name cannot be less than 3 letters")
    .max(15, "User name cannot be less than 3 letters")
    .trim(),

  email: z.string().email("Please provide a valid email id").nonempty().trim(),
  password: z
    .string()
    .nonempty()
    .min(
      8,
      "Please enter a valid password with alphanumeric characters  eg:- @example%$123"
    ),
});

const LoginSchema = z.object({
  email: z.string().email("Please provide a valid email id").nonempty().trim(),
  password: z
    .string()
    .nonempty()
    .min(
      8,
      "Please enter a valid password with alphanumeric characters  eg:- @example%$123"
    ),
});

export { SignSchema, LoginSchema };
