const imageModules = import.meta.glob("./assets/*.{jpg,jpeg,png,webp}");

let images: string[] | null = null;

async function loadImages() {
  if (images) return images; // cache
  const mods = await Promise.all(Object.values(imageModules).map(fn => fn()));
  images = mods.map(mod => (mod as { default: string }).default);
  return images;
}

export async function getRandomImage(): Promise<string> {
  const imgs = await loadImages();
  const randomIndex = Math.floor(Math.random() * imgs.length);
  return imgs[randomIndex];
}
