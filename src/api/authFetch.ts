import { useRouter } from "vue-router";

export async function useFetch<T>(
  route: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  body: unknown | undefined
): Promise<T | 401 | undefined> {
  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER_API}${route}`, {
      method: `${method}`,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include", // only if your server uses cookies
    });

    console.log(`Just fetched for route: ${route}`);
    console.log("res right after return: ", res);
    // bad credentials, Tokens. Send user back to login, to re log in.
    if (res.status === 401) {
      // send user back to login
      // useRouter().replace("/login");
      return 401;
    }

    // if (!res.ok) {
    //   const errBody = await res.json(); // server's JSON error response
    //   throw new Error(errBody || "Unknown error from server");
    // }

    return (await res.json()) as T;
  } catch (error) {
    console.log("fetch error caught: ", error);
    return undefined;
  }
}
