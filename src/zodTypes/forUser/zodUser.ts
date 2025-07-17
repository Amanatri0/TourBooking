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

// for updating user information like email, password etc
const UpdateUserinfo = z
  .object({
    username: z
      .string()
      .min(5, "User name cannot be less than 3 letters")
      .max(15, "User name cannot be less than 3 letters")
      .trim()
      .optional(),
    email: z
      .string()
      .email("Please provide a valid email id")
      .trim()
      .optional(),
    phoneNumber: z
      .string()
      .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" })
      .optional(),
    oldPassword: z
      .string()
      .min(
        8,
        "Please enter a valid password with alphanumeric characters  eg:- @example%$123"
      )
      .optional(),
    newPassword: z
      .string()
      .min(
        8,
        "Please enter a valid password with alphanumeric characters  eg:- @example%$123"
      )
      .optional(),
    confirmPassword: z
      .string()
      .min(
        8,
        "Please enter a valid password with alphanumeric characters  eg:- @example%$123"
      )
      .optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export { SignSchema, LoginSchema, UpdateUserinfo };
