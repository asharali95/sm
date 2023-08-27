export default async function validateRequest(data, schema) {
  const _data = await schema.validate(data, {
    abortEarly: false,
    strict: true,
  });
  return _data;
}
