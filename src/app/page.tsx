import ImageDropzone from "@/components/ImageDropzone";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-12 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Upload Images
        </h1>
        <ImageDropzone />
      </main>
    </div>
  );
}
