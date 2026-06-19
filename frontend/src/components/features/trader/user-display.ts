import type { ApiUser } from "@/lib/api";

export function getUserInitials(user: Pick<ApiUser, "fullName" | "email">) {
  const nameParts = user.fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (nameParts.length > 0) {
    return nameParts
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  return user.email.slice(0, 2).toUpperCase();
}
