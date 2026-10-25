import { redirect } from "react-router"
import { logout } from "@/lib/session.server"

export const action = () => logout()

export const loader = () => redirect("/")
