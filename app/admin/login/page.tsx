import type { Metadata } from "next";
import LoginClient from "./LoginClient";
import "../../../styles/admin.css";

export const metadata: Metadata = {
  title: "Admin Sign In | Vicky Farmhouse",
  // Keep the admin area out of search results — it lives on the public domain.
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <LoginClient />;
}
