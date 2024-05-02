import { type LoaderFunction, json } from "@remix-run/node";
import { z } from "zod";
import { getCookieUserPrefs, userPrefsCookie } from "~/modules/cookie.server";

const themeSchema = z.object({
  theme: z.enum(["light", "dark"]),
});

export const action: LoaderFunction = async ({ request }) => {
  const formPayload = Object.fromEntries(await request.formData());

  try {
    const fields = themeSchema.parse(formPayload);
    const userPrefs = getCookieUserPrefs(request);

    return json(
      {
        theme: fields.theme,
      },
      {
        headers: {
          "Set-Cookie": await userPrefsCookie.serialize({
            ...userPrefs,
            colorScheme: fields.theme,
          }),
        },
      },
    );
  } catch (error) {
    return json("Invalid theme value. Please provide a valid theme value.", {
      status: 400,
    });
  }
};
