export type Errors = Record<string, string>;

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function validateLogin(email: string, password: string): Errors {
  const e: Errors = {};
  if (!isEmail(email)) e.email = "Enter a valid email";
  if (!password) e.password = "Password is required";
  return e;
}

export function validateRegister(name: string, email: string, password: string): Errors {
  const e: Errors = {};
  if (name.trim().length < 2) e.name = "Enter your name";
  if (!isEmail(email)) e.email = "Enter a valid email";
  if (password.length < 6) e.password = "Min 6 characters";
  return e;
}

export function validateCustomer(c: { name: string; email: string; mobile: string; address: string; license: string }): Errors {
  const e: Errors = {};
  if (c.name.trim().length < 2) e.name = "Enter full name";
  if (!isEmail(c.email)) e.email = "Enter a valid email";
  if (c.mobile.replace(/\D/g, "").length < 10) e.mobile = "Enter a valid mobile number";
  if (c.address.trim().length < 5) e.address = "Enter full address";
  if (c.license.trim().length < 5) e.license = "Enter license number";
  return e;
}

export function validateCar(c: { brand: string; model: string; year: string; pricePerDay: string; seating: string }): Errors {
  const e: Errors = {};
  if (!c.brand.trim()) e.brand = "Brand is required";
  if (!c.model.trim()) e.model = "Model is required";
  const year = Number(c.year);
  if (!year || year < 2000 || year > new Date().getFullYear() + 1) e.year = "Enter a valid year";
  if (!Number(c.pricePerDay) || Number(c.pricePerDay) <= 0) e.pricePerDay = "Enter price per day";
  if (!Number(c.seating) || Number(c.seating) < 2) e.seating = "Enter seating capacity";
  return e;
}
