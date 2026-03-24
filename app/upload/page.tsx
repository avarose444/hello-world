import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function UploadPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  return (
    <>
      <h1 className="h1">Upload → Generate Captions</h1>
      <p className="sub">Upload an image to generate captions.</p>

      <div className="card">
        <p>Upload form goes here.</p>
      </div>
    </>
  );
}