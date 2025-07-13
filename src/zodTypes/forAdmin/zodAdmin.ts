import z from "zod";

// only admin can access for updating user roles to subdamin
const UpdateUserRoleSchema = z.object({
  id: z.string().nonempty(),
  email: z.string().email().optional(),
  newRole: z.number().nonnegative(),
});

// only admin can create cars
const CarSchema = z.object({
  carName: z.string().nonempty(),
  carImage: z.string().nonempty(),
  carNumber: z.string().nonempty(),
  distance: z.number().nonnegative(),
  capacity: z.number().nonnegative(),
  fair: z.number().nonnegative(),
  // createdBy: z.string(),
  // assignedTo: z.string(),
});

// only amdin can create tour packages

const TourSchema = z.object({
  tourName: z.string(),
  description: z.string(),
  fair: z.number().nonnegative(),
});

export { CarSchema, UpdateUserRoleSchema, TourSchema };
