import z from "zod";

// only admin can access for updating user roles to subdamin
const UpdateUserRoleSchema = z.object({
  id: z
    .string()
    .nonempty("Please provide Id of the user that you want to update")
    .trim(),
  email: z
    .string()
    .email(" Please provide email of the user that you want to update")
    .optional(),
  newRole: z
    .number()
    .nonnegative(
      "Please enter the type of role that you want to give to the user"
    ),
});

// only admin can create cars
const CarSchema = z.object({
  carName: z.string().nonempty(),
  carImage: z.string().nonempty(),
  carNumber: z.string().nonempty().trim(),
  distance: z.number().nonnegative(),
  capacity: z.number().nonnegative(),
  fair: z.number().nonnegative(),
  // createdBy: z.string(),
  // assignedTo: z.string(),
});

// update car schema
const UpdateCarSchema = z.object({
  id: z.string().nonempty(),
  carName: z.string(),
  carImage: z.string(),
  carNumber: z.string().trim(),
  distanace: z.number().nonnegative(),
  capacity: z.number().nonnegative(),
  fair: z.number().nonnegative(),
});

//delete car
const DeleteCarSchema = z.object({
  id: z.string().nonempty().trim(),
  carName: z.string().optional(),
  carNumber: z.string().trim(),
});

// only amdin can create tour packages
const TourSchema = z.object({
  tourName: z.string().trim(),
  description: z.string(),
  fair: z.number().nonnegative(),
});

// update tour
const UpdateTourSchema = z.object({
  id: z.string().nonempty(),
  tourName: z.string().trim(),
  description: z.string(),
  fair: z.number().nonnegative(),
});

// Delete tour
const DeleteTourSchema = z.object({
  id: z.string().nonempty().trim(),
  tourName: z.string().trim().optional(),
});

export {
  CarSchema,
  UpdateUserRoleSchema,
  TourSchema,
  UpdateCarSchema,
  UpdateTourSchema,
  DeleteCarSchema,
  DeleteTourSchema,
};
