import type { APIRoute } from "astro";

/** Cierra la sesión (POST para evitar cierres por enlaces de terceros). */
export const POST: APIRoute = async ({ locals, redirect }) => {
  await locals.supabase.auth.signOut();
  return redirect("/login", 303);
};
