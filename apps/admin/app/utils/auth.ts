import Cookies from "js-cookie"

export const getAuthCookie = () => {
  return Cookies.get("auth")
}

export const setAuthCookie = (token: string) => {
  Cookies.set("auth", token)
}
