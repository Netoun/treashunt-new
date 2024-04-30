import { createCookie } from "@remix-run/node";

export const userPrefsCookie = createCookie("user-prefs", {
    maxAge: 604_800, // one week
});

export const getColorSchemeToken = async (request: Request) => {
    const cookie = await userPrefsCookie.parse(request.headers.get('Cookie'))
    return cookie
}

export const getCookieUserPrefs = async (request: Request) => {
    const cookieHeader = request.headers.get("Cookie");
    const cookie =
        (await userPrefsCookie.parse(cookieHeader)) || {};

    const systemPreferredColorScheme = request.headers.get(
        'Sec-CH-Prefers-Color-Scheme'
    )
    return {
        colorScheme: cookie.colorScheme ?? systemPreferredColorScheme ?? 'light',
        language: cookie.language ?? 'en'
    }
};
