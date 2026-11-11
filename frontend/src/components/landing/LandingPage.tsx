"use client";

import Image from "next/image";
import { useDropzone } from "react-dropzone";
import ImageDropzone from "@/components/ImageDropzone";
import LandingHeader from "@/components/landing/LandingHeader";
import SampleRoomLink from "@/components/landing/SampleRoomLink";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES, SAMPLE_ROOM_URL } from "@/lib/roomUpload";

const SAMPLE_ROOM_SIZE = 4096;

interface LandingPageProps {
  onRoomSelected: (file: File) => void;
}

export default function LandingPage({ onRoomSelected }: LandingPageProps) {
  const dropzone = useDropzone({
    accept: ACCEPTED_IMAGE_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: false,
    noClick: true,
    onDropAccepted: ([file]) => onRoomSelected(file),
  });

  return (
    <div className="flex flex-1 flex-col bg-night font-sans">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-8 md:px-12">
        <LandingHeader onGetStarted={dropzone.open} />

        <main className="grid items-center gap-12 lg:grid-cols-2">
          <section className="flex max-w-md flex-col gap-6">
            <h1 className="font-serif text-6xl leading-[1.05] text-ivory md:text-7xl">Welcome to Blueprint</h1>
            <p className="text-lg leading-relaxed text-mist">
              Upload a photo and play with the possibilities before you move a thing.
            </p>
            <ImageDropzone dropzone={dropzone} />
            <SampleRoomLink onSampleLoaded={onRoomSelected} />
          </section>

          <Image
            src={SAMPLE_ROOM_URL}
            alt="A sage-green bedroom with plants, a woven pendant lamp and orange throw pillows"
            width={SAMPLE_ROOM_SIZE}
            height={SAMPLE_ROOM_SIZE}
            sizes="(min-width: 1024px) 50vw, 100vw"
            preload
            className="aspect-square w-full rounded-[28px] object-cover"
          />
        </main>
      </div>
    </div>
  );
}
