import type { Metadata } from "next";
import AdminClient from "./AdminClient";
import "../../styles/admin.css";

export const metadata: Metadata = {
  title: "Admin | Vicky Farmhouse",
  // The dashboard lives on the public domain — keep it out of search results.
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
