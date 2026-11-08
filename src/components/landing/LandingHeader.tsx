import { ArrowUpRightIcon, FlowerIcon } from "@/components/landing/icons";

interface LandingHeaderProps {
  onGetStarted: () => void;
}

export default function LandingHeader({ onGetStarted }: LandingHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-grape-light">
        <FlowerIcon className="h-7 w-7" />
        <span className="font-serif text-3xl text-ivory">blueprint</span>
      </div>

      <nav className="flex items-center gap-6">
        <button type="button" className="text-sm text-ivory transition-colors hover:text-grape-light">
          Log in
        </button>
        <button
          type="button"
          onClick={onGetStarted}
          className="flex items-center gap-3 rounded-full bg-ivory px-6 py-3 text-sm font-medium text-night transition-colors hover:bg-lilac"
        >
          Make it yours
          <ArrowUpRightIcon className="h-4 w-4 text-mist" />
        </button>
      </nav>
    </header>
  );
}
