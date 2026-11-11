import type { Accept } from "react-dropzone";

const BYTES_PER_MEGABYTE = 1024 * 1024;

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * BYTES_PER_MEGABYTE;

export const ACCEPTED_IMAGE_TYPES: Accept = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
};

export const SAMPLE_ROOM_URL = "/landing/landing-room.jpg";
export const SAMPLE_ROOM_FILE_NAME = "sample-room.jpg";
