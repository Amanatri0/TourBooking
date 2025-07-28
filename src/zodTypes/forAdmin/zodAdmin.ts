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

//------------------------------------------------------- Car Validator ----------------------------------------------------------

// only admin can create cars
const CarSchema = z.object({
  carName: z.string().nonempty(),
  carImage: z.string().nonempty().optional(),
  carNumber: z.string().nonempty().trim(),
  distance: z.string().nonempty(),
  capacity: z.string().nonempty(),
  fair: z.string().nonempty(),
  // createdBy: z.string(),
  // assignedTo: z.string(),   // ---> try to solve it
});

// update car schema
const UpdateCarSchema = z.object({
  id: z.string().nonempty().optional(),
  carName: z.string().optional(),
  carImage: z.string().optional(),
  carNumber: z.string().trim().optional(),
  distanace: z.string().nonempty().optional(),
  capacity: z.string().nonempty().optional(),
  fair: z.string().nonempty().optional(),
});

//delete car
const DeleteCarSchema = z.object({
  id: z.string().nonempty().trim(),
  carName: z.string().optional(),
  carNumber: z.string().trim(),
});

//------------------------------------------------------- Tour Validator ----------------------------------------------------------

// only amdin can create tour packages
const TourSchema = z.object({
  tourName: z.string().trim(),
  description: z.string(),
  fair: z.number().nonnegative(),
});

// update tour
const UpdateTourSchema = z.object({
  id: z.string().nonempty().optional(),
  tourName: z.string().trim().optional(),
  description: z.string().optional(),
  fair: z.number().nonnegative().optional(),
});

// Delete tour
const DeleteTourSchema = z.object({
  id: z.string().nonempty().trim(),
  tourName: z.string().trim().optional(),
});

//------------------------------------------------------- Driver Validator ----------------------------------------------------------

// Create Driver
const DriverSchema = z.object({
  driverName: z.string().nonempty(),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),
  driverAddhar: z
    .string()
    .regex(/^\d{12}$/, { message: "Aadhar must be exactly 12 digits" }),
  driverPan: z
    .string()
    .length(10, { message: "PAN must be exactly 10 characters" }),
  driverLicense: z
    .string()
    .trim()
    .length(15, { message: "License number must be exactly 15 characters" }),
  carId: z.string(),
});

// Update Driver details
const UpdateDriverSchema = z.object({
  driverName: z.string().nonempty().optional(),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" })
    .optional(),

  driverAddhar: z
    .string()
    .regex(/^\d{12}$/, { message: "Aadhar must be exactly 12 digits" })
    .optional(),

  driverPan: z
    .string()
    .length(10, { message: "PAN must be exactly 10 characters" })
    .optional(),

  driverLicense: z
    .string()
    .trim()
    .length(15, { message: "License number must be exactly 15 characters" })
    .optional(),
  carId: z.string().optional(),
});

export {
  CarSchema,
  UpdateUserRoleSchema,
  TourSchema,
  UpdateCarSchema,
  UpdateTourSchema,
  DeleteCarSchema,
  DeleteTourSchema,
  DriverSchema,
  UpdateDriverSchema,
};
