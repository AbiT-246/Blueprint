"use client";

import { useState, type FormEvent } from "react";
import SidebarStatusMessage from "@/components/SidebarStatusMessage";
import {
  SIDEBAR_CARD_CLASS,
  SIDEBAR_ITEM_ACTION_BUTTON_CLASS,
  SIDEBAR_ITEM_ACTION_BUTTON_DISABLED_CLASS,
  SIDEBAR_SEARCH_INPUT_CLASS,
  SIDEBAR_SEARCH_SUBMIT_CLASS,
} from "@/components/sidebarStyles";
import { type AsyncResource } from "@/hooks/useAsyncResource";
import { searchEbayItems, type EbayItemSummary } from "@/lib/api/ebay";

type SearchState = { status: "idle" } | AsyncResource<EbayItemSummary[]>;

export default function EbaySearchPanel() {
  const [keyword, setKeyword] = useState("");
  const [searchState, setSearchState] = useState<SearchState>({ status: "idle" });

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      return;
    }

    setSearchState({ status: "loading" });

    try {
      const response = await searchEbayItems(trimmedKeyword);
      setSearchState({
        status: "ready",
        data: response.itemSummaries ?? [],
      });
    } catch {
      setSearchState({ status: "error" });
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-mist">
        Search eBay for furniture and decor that fits your room.
      </p>

      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        <label className="sr-only" htmlFor="ebay-search">
          Search eBay
        </label>
        <div className="flex gap-2">
          <input
            id="ebay-search"
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Try desk lamp, rug, chair..."
            className={SIDEBAR_SEARCH_INPUT_CLASS}
            autoComplete="off"
          />
          <button type="submit" className={SIDEBAR_SEARCH_SUBMIT_CLASS} disabled={!keyword.trim()}>
            Search
          </button>
        </div>
      </form>

      <SearchResults state={searchState} />
    </div>
  );
}

function SearchResults({ state }: { state: SearchState }) {
  if (state.status === "idle") {
    return null;
  }

  if (state.status === "loading") {
    return <SidebarStatusMessage message="Searching eBay..." />;
  }

  if (state.status === "error") {
    return (
      <SidebarStatusMessage message="Unable to search eBay right now. Please try again." isError />
    );
  }

  if (state.data.length === 0) {
    return <SidebarStatusMessage message="No items found. Try a different keyword." />;
  }

  return (
    <ul className="flex flex-col gap-4">
      {state.data.map((item) => (
        <li key={item.itemId}>
          <EbayItemCard item={item} />
        </li>
      ))}
    </ul>
  );
}

function EbayItemCard({ item }: { item: EbayItemSummary }) {
  const priceLabel = formatPrice(item.price);
  const imageUrl = item.image?.imageUrl;

  return (
    <article className={SIDEBAR_CARD_CLASS}>
      <div className="relative aspect-square w-full bg-night-raised">
        {imageUrl ? (
          // eBay listing images come from varying CDNs; native img avoids Next remote config gaps.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={item.title} className="h-full w-full object-contain p-4" />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-mist">
            No image available
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 px-4 py-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-ivory">{item.title}</h3>
          {priceLabel && <p className="text-sm text-mist">{priceLabel}</p>}
        </div>

        <div className="flex gap-2">
          <button type="button" disabled className={SIDEBAR_ITEM_ACTION_BUTTON_DISABLED_CLASS}>
            Add to room
          </button>
          {item.itemWebUrl ? (
            <a
              href={item.itemWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={SIDEBAR_ITEM_ACTION_BUTTON_CLASS}
            >
              Shop now
            </a>
          ) : (
            <span className={SIDEBAR_ITEM_ACTION_BUTTON_DISABLED_CLASS}>Shop now</span>
          )}
        </div>
      </div>
    </article>
  );
}

function formatPrice(price: EbayItemSummary["price"]): string | null {
  if (!price?.value) {
    return null;
  }

  return `${price.currency} ${price.value}`;
}
