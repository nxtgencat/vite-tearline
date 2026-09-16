import axios from "axios";

export interface DummyAuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

// Sign in with any DummyJSON user, e.g. emilys / emilyspass
// Docs: POST https://dummyjson.com/auth/login { username, password }
export async function loginToDummyJSON(
  usernameOrEmail: string,
  password: string
): Promise<DummyAuthUser> {
  let username = usernameOrEmail.trim();
  // DummyJSON auth expects a username — resolve email -> username first
  if (username.includes("@")) {
    try {
      const res = await axios.get<{ users: Array<{ username: string }> }>(
        `https://dummyjson.com/users/filter?key=email&value=${encodeURIComponent(username)}`
      );
      if (res.data.users.length > 0) username = res.data.users[0].username;
    } catch {
      // fall through and try raw value
    }
  }
  const res = await axios.post<DummyAuthUser>("https://dummyjson.com/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });
  return res.data;
}

// Sign up via DummyJSON (simulated — returns new user with id)
export async function registerOnDummyJSON(name: string, email: string) {
  const [firstName, ...rest] = name.trim().split(" ");
  const res = await axios.post("https://dummyjson.com/users/add", {
    firstName: firstName || name,
    lastName: rest.join(" ") || "Manager",
    email: email.trim(),
  });
  return res.data as { id: number };
}

export const DEMO_CREDS = { username: "emilys", password: "emilyspass" };
