import { supa } from "./supabase";

const BUCKET = "heat-media";
const MAX_DIM = 1400;

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_DIM || height > MAX_DIM) {
        const r = Math.min(MAX_DIM / width, MAX_DIM / height);
        width *= r; height *= r;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("canvas"));
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(b => b ? resolve(b) : reject(new Error("compress")), "image/jpeg", 0.85);
    };
    img.onerror = () => reject(new Error("load"));
    img.src = URL.createObjectURL(file);
  });
}

export async function uploadPhoto(coupleId: string, file: File): Promise<string> {
  const blob = await compressImage(file);
  const path = `${coupleId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supa.storage.from(BUCKET).upload(path, blob, {
    contentType: "image/jpeg",
    upsert: false,
    cacheControl: "60",
  });
  if (error) throw error;
  return path;
}

export async function getPhotoSignedUrl(path: string): Promise<string> {
  const { data, error } = await supa.storage.from(BUCKET).createSignedUrl(path, 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function markMessageViewed(messageId: string) {
  const { error } = await supa
    .from("heat_messages")
    .update({ viewed_at: new Date().toISOString() })
    .eq("id", messageId);
  if (error) console.error("mark viewed", error);
}
