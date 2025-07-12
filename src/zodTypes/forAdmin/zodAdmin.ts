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

export { CarSchema, UpdateUserRoleSchema };
