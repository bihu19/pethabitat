import { createClient } from "@/lib/supabase/client";

/**
 * Image types we accept. SVG is deliberately excluded: it can carry inline
 * script, and these buckets are public, so an uploaded SVG opened directly
 * would execute in the storage origin.
 */
const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export class UploadValidationError extends Error {}

/**
 * Validates a file before upload. Callers should run this at selection time so
 * the user gets feedback immediately rather than on submit.
 *
 * Note this is a client-side check for UX only — it is bypassable. The
 * authoritative limits are the bucket's `allowed_mime_types` and
 * `file_size_limit`, set in supabase/migrations.
 */
export function validateImageFile(file: File): void {
  if (!ALLOWED_MIME_TYPES[file.type]) {
    throw new UploadValidationError(
      "Please choose a JPEG, PNG, WebP or GIF image."
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadValidationError("Image must be smaller than 5MB.");
  }
}

export async function uploadImage(
  bucket: "avatars" | "pet-photos",
  userId: string,
  file: File,
  pathPrefix?: string
): Promise<string> {
  validateImageFile(file);

  const supabase = createClient();

  // Derive the extension from the validated MIME type rather than the
  // client-supplied filename, which is attacker-controlled.
  const ext = ALLOWED_MIME_TYPES[file.type];

  // The storage policies match on the first path segment being the user's id
  // (`(storage.foldername(name))[1] = auth.uid()`), so userId must lead. A
  // random name avoids collisions between concurrent uploads and stops paths
  // from being guessable.
  const segments = [userId, pathPrefix, `${crypto.randomUUID()}.${ext}`].filter(
    Boolean
  );
  const fileName = segments.join("/");

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    // Names are random, so there is nothing legitimate to overwrite. upsert
    // would let a caller replace an existing object at a chosen path.
    upsert: false,
    contentType: file.type,
    cacheControl: "31536000",
  });

  if (error) {
    // Deliberately generic: the raw storage error can name buckets and policies.
    console.error("Image upload failed", error);
    throw new Error("Upload failed. Please try again.");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}
