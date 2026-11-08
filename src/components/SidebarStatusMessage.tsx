interface SidebarStatusMessageProps {
  message: string;
  isError?: boolean;
}

export default function SidebarStatusMessage({ message, isError = false }: SidebarStatusMessageProps) {
  const colorClass = isError ? "text-red-400" : "text-mist";
  return <p className={`text-sm ${colorClass}`}>{message}</p>;
}
