import { createClient } from "@/lib/supabase/client";

export async function uploadImage(
  bucket: "avatars" | "pet-photos",
  userId: string,
  file: File,
  pathPrefix?: string
): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = pathPrefix
    ? `${pathPrefix}/${userId}/${Date.now()}.${ext}`
    : `${userId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: true });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}
