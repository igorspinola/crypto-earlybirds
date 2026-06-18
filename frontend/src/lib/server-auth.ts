import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ApiError,
  getCurrentUser,
  getHomePathByRole,
  type UserRole,
} from "./api";

export async function requireUserRole(allowedRoles: UserRole[]) {
  const cookieHeader = await getServerCookieHeader();

  if (!cookieHeader) {
    redirect("/login");
  }

  try {
    const user = await getCurrentUser(cookieHeader);

    if (allowedRoles.includes(user.role)) {
      return user;
    }

    redirect(getHomePathByRole(user.role));
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      redirect("/login");
    }

    throw error;
  }
}

async function getServerCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore.toString();
}
