interface SidebarStatusMessageProps {
  message: string;
  isError?: boolean;
}

export default function SidebarStatusMessage({ message, isError = false }: SidebarStatusMessageProps) {
  const colorClass = isError ? "text-red-600 dark:text-red-400" : "text-zinc-500 dark:text-zinc-400";
  return <p className={`text-sm ${colorClass}`}>{message}</p>;
}
