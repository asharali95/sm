import * as yup from "yup";

const emailRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
//Required in case of user creating
export const userSchema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .matches(
      emailRegex,
      `Password Must Contain at Least 8 Characters,One Uppercase,One Lowercase, One Number, & One Special Character`
    )
    .required("password is required"),
  role: yup.string().required().oneOf(["employee", "employer"]),
  name: yup.string(),
  about: yup.string(),
  image: yup.object().shape({
    url: yup.string().required(),
    publicId: yup.string().required(),
    _id: yup.string(),
  }),
  social: yup.string(),
  phone: yup.string(),
  address: yup.string(),
  education: yup.object().shape({
    level: yup.string(),
    field: yup.string(),
  }),
  experience: yup.object().shape({
    title: yup.string(),
    company: yup.string(),
  }),
  resume: yup.object().shape({
    url: yup.string().required(),
    publicId: yup.string().required(),
    _id: yup.string(),
  }),
  skills: yup.array().of(yup.string()),
  appliedJobs: yup.array().of(yup.string()),
  savedJobs: yup.array().of(yup.string()),
  PrivateFields: yup.array().of(yup.string()),

  currentEmployer: yup.string(),
  currentEmployment: yup.string(),
  avilableFrom: yup.date(),
  website: yup.string(),
  verified: yup.boolean(),
});

export const dynamicUserSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .when("$email", {
      is: (email) => email != null && email !== "",
      then: yup.string().required("Email is required"),
    }),
  password: yup.string().when("$password", {
    is: (password) => password != null && password !== "",
    then: yup
      .string()
      .matches(
        emailRegex,
        `Password Must Contain at Least 8 Characters,One Uppercase,One Lowercase, One Number, & One Special Character`
      )
      .required("Passpassword is required"),
  }),
  role: yup.string().when("$role", {
    is: (role) => role != null && role !== "",
    then: yup
      .string()
      .required("Role is required")
      .oneOf(["employee", "employer"]),
  }),
  name: yup.string().when("$name", {
    is: (name) => name != null && name !== "",
    then: yup.string(),
  }),
  about: yup.string().when("$about", {
    is: (about) => about != null && about !== "",
    then: yup.string(),
  }),

  image: yup.object().when("$image", {
    is: (image) => image != null && image !== "",
    then: yup.object().shape({
      url: yup.string().required(),
      publicId: yup.string().required(),
      _id: yup.string(),
    }),
  }),

  social: yup.string().when("$social", {
    is: (social) => social != null && social !== "",
    then: yup.string(),
  }),

  phone: yup.string().when("$phone", {
    is: (phone) => phone != null && phone !== "",
    then: yup.string(),
  }),

  address: yup.string().when("$address", {
    is: (address) => address != null && address !== "",
    then: yup.string(),
  }),

  education: yup.object().when("$education", {
    is: (education) => education != null && education !== "",
    then: yup.object().shape({
      level: yup.string(),
      field: yup.string(),
    }),
  }),

  experience: yup.object().when("$experience", {
    is: (experience) => experience != null && experience !== "",
    then: yup.object().shape({
      title: yup.string(),
      company: yup.string(),
    }),
  }),

  resume: yup.object().when("$resume", {
    is: (resume) => resume != null && resume !== "",
    then: yup.object().shape({
      url: yup.string().required(),
      publicId: yup.string().required(),
      _id: yup.string(),
    }),
  }),

  skills: yup
    .array()
    .of(yup.string())
    .when("$skills", {
      is: (skills) => skills != null,
      then: yup.array().of(yup.string()),
    }),

  appliedJobs: yup
    .array()
    .of(yup.string())
    .when("$appliedJobs", {
      is: (appliedJobs) => appliedJobs != null,
      then: yup.array().of(yup.string()),
    }),
  savedJobs: yup
    .array()
    .of(yup.string())
    .when("$savedJobs", {
      is: (savedJobs) => savedJobs != null,
      then: yup.array().of(yup.string()),
    }),
  privateFields: yup
    .array()
    .of(yup.string())
    .when("$privateFields", {
      is: (privateFields) => privateFields != null,
      then: yup.array().of(yup.string()),
    }),

  currentEmployer: yup.string().when("$currentEmployer", {
    is: (currentEmployer) => currentEmployer != null && currentEmployer !== "",
    then: yup.string(),
  }),

  currentEmployment: yup.string().when("$currentEmployment", {
    is: (currentEmployment) =>
      currentEmployment != null && currentEmployment !== "",
    then: yup.string(),
  }),

  avilableFrom: yup.date().when("$avilableFrom", {
    is: (avilableFrom) => avilableFrom != null && avilableFrom !== "",
    then: yup.date(),
  }),
  website: yup.string().when("$website", {
    is: (website) => website != null && website !== "",
    then: yup.string(),
  }),
  verified: yup.boolean().when("$verified", {
    is: (verified) => verified != null && verified !== "",
    then: yup.boolean(),
  }),
});
