export const jsToJson = (val: string) => {
  try {
    return JSON.stringify(eval(`(${val})`), null, 2);
  } catch (e) {
    return (e as any)?.message || "Invalid JS";
  }
};

export const jsonToJs = (_val: string) => {
  return "Not implemented yet";
};
