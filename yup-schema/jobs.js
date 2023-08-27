import * as yup from "yup";

export const jobSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  company: yup.string().required("Company ID is required"),
  recruiter: yup.string().required(""),
  recruiterWebsite: yup.string(),
  recruiterImage: yup.object().shape({
    url: yup.string().required(),
    publicId: yup.string().required(),
    _id: yup.string(),
  }),
  location: yup.string().required("Location is required"),
  type: yup
    .string()
    .required("Job type is required")
    .oneOf(["Full-time", "Part-time"]),
  draft: yup.boolean(),
  publish: yup.boolean(),
  salary: yup.string(),
  deadline: yup.date().required("Deadline is required"),
  vacancies: yup.number(),
  applicants: yup.array().of(
    yup.object().shape({
      user: yup.string(),
      privateFields: yup.array().of(yup.string()),
    })
  ),
  summary: yup.string(),
  contactPersonName: yup.string(),
  contactPersonEmail: yup.string(),
  contactPersonDesignation: yup.string(),
  contactPersonPhone: yup.string(),
  contactPersonLinkedIn: yup.string(),
  contactPersonImage: yup.object().shape({
    url: yup.string(),
    publicId: yup.string(),
    _id: yup.string(),
  }),
});

export const dynamicJobSchema = yup.object().shape({
  title: yup.string().when("$title", {
    is: (title) => title != null && title !== "",
    then: yup.string().required("Title is required"),
  }),
  description: yup.string().when("$description", {
    is: (description) => description != null && description !== "",
    then: yup.string().required("Description is required"),
  }),
  recruiter: yup.string().when("$recruiter", {
    is: (recruiter) => recruiter != null && recruiter !== "",
    then: yup.string(),
  }),
  recruiterWebsite: yup.string().when("$recruiterWebsite", {
    is: (recruiterWebsite) =>
      recruiterWebsite != null && recruiterWebsite !== "",
    then: yup.string(),
  }),
  recruiterImage: yup.object().when("$recruiterImage", {
    is: (recruiterImage) => recruiterImage != null && recruiterImage !== "",
    then: yup.object().shape({
      url: yup.string(),
      publicId: yup.string(),
      _id: yup.string(),
    }),
  }),
  company: yup.string().when("$company", {
    is: (company) => company != null && company !== "",
    then: yup.string(),
  }),
  location: yup.string().when("$location", {
    is: (location) => location != null && location !== "",
    then: yup.string(),
  }),
  type: yup.string().when("$type", {
    is: (value) => value != null,
    then: yup
      .string()

      .oneOf(["Full-time", "Part-time", ""]),
  }),
  draft: yup.boolean().when("$draft", {
    is: (draft) => draft != null && draft !== "",
    then: yup.boolean(),
  }),
  publish: yup.boolean().when("$publish", {
    is: (publish) => publish != null && publish !== "",
    then: yup.boolean(),
  }),
  salary: yup.string().when("$salary", {
    is: (salary) => salary != null && salary !== "",
    then: yup.string(),
  }),
  deadline: yup.date().when("$deadline", {
    is: (deadline) => deadline != null && deadline !== "",
    then: yup.date(),
  }),
  vacancies: yup.number().when("$vacancies", {
    is: (vacancies) => vacancies != null && vacancies !== "",
    then: yup.number(),
  }),
  applicants: yup
    .array()
    .of(yup.object())
    .when("$applicants", {
      is: (applicants) => applicants != null,
      then: yup.object().shape({
        user: yup.string(),
        privateFields: yup.array().of(yup.string()),
      }),
    }),
  summary: yup.string().when("$summary", {
    is: (summary) => summary != null && summary !== "",
    then: yup.string(),
  }),

  contactPersonName: yup.string().when("$contactPersonName", {
    is: (contactPersonName) =>
      contactPersonName != null && contactPersonName !== "",
    then: yup.string(),
  }),

  contactPersonEmail: yup.string().when("$contactPersonEmail", {
    is: (contactPersonEmail) =>
      contactPersonEmail != null && contactPersonEmail !== "",
    then: yup.string(),
  }),
  contactPersonDesignation: yup.string().when("$contactPersonDesignation", {
    is: (contactPersonDesignation) =>
      contactPersonDesignation != null && contactPersonDesignation !== "",
    then: yup.string(),
  }),
  contactPersonPhone: yup.string().when("$contactPersonPhone", {
    is: (contactPersonPhone) =>
      contactPersonPhone != null && contactPersonPhone !== "",
    then: yup.string(),
  }),
  contactPersonLinkedIn: yup.string().when("$contactPersonLinkedIn", {
    is: (contactPersonLinkedIn) =>
      contactPersonLinkedIn != null && contactPersonLinkedIn !== "",
    then: yup.string(),
  }),
  contactPersonImage: yup.object().when("$contactPersonImage", {
    is: (contactPersonImage) =>
      contactPersonImage != null && contactPersonImage !== "",
    then: yup.object().shape({
      url: yup.string(),
      publicId: yup.string(),
      _id: yup.string(),
    }),
  }),
});
