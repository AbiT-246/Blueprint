export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Unable to read file ${file.name}`));
    reader.readAsDataURL(file);
  });
}

export async function fetchFile(url: string, fileName: string): Promise<File> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Unable to fetch ${url} (status ${response.status})`);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
}

export function base64ToFile(base64: string, mimeType: string, fileName: string): File {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new File([bytes], fileName, { type: mimeType });
}
