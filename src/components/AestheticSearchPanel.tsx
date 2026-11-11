"use client";

import { useEffect, useState, type FormEvent } from "react";
import IkeaProductResults from "@/components/IkeaProductResults";
import SidebarStatusMessage from "@/components/SidebarStatusMessage";
import {
  SIDEBAR_SEARCH_INPUT_CLASS,
  SIDEBAR_SEARCH_SUBMIT_CLASS,
} from "@/components/sidebarStyles";
import {
  searchStoreProducts,
  STORE_LABELS,
  type ShoppingStore,
  type StoreProduct,
} from "@/lib/api/catalog";

const SEARCH_PAGE_SIZE = 24;
const AMAZON_LIST_PAGE_SIZE = 50;
const DEFAULT_IKEA_SEARCH_KEYWORD = "decor";

interface AestheticSearchPanelProps {
  store: ShoppingStore;
  aestheticLabel: string;
  onProductSelect: (product: StoreProduct) => void;
}

type SearchState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; products: StoreProduct[]; searchPhrase: string };

export default function AestheticSearchPanel({
  store,
  aestheticLabel,
  onProductSelect,
}: AestheticSearchPanelProps) {
  const [keyword, setKeyword] = useState("");
  const [searchState, setSearchState] = useState<SearchState>({ status: "loading" });
  const storeLabel = STORE_LABELS[store];

  useEffect(() => {
    let isActive = true;

    setSearchState({ status: "loading" });

    const query =
      store === "amazon"
        ? ""
        : buildAestheticSearchQuery(aestheticLabel, DEFAULT_IKEA_SEARCH_KEYWORD);
    const size = store === "amazon" ? AMAZON_LIST_PAGE_SIZE : SEARCH_PAGE_SIZE;

    searchStoreProducts(store, query, size)
      .then((response) => {
        if (!isActive) {
          return;
        }

        setSearchState({
          status: "ready",
          products: response.products,
          searchPhrase: response.searchPhrase,
        });
      })
      .catch(() => {
        if (isActive) {
          setSearchState({ status: "error" });
        }
      });

    return () => {
      isActive = false;
    };
  }, [store, aestheticLabel]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      return;
    }

    const query =
      store === "amazon"
        ? trimmedKeyword
        : buildAestheticSearchQuery(aestheticLabel, trimmedKeyword);
    const size = store === "amazon" ? AMAZON_LIST_PAGE_SIZE : SEARCH_PAGE_SIZE;
    setSearchState({ status: "loading" });

    try {
      const response = await searchStoreProducts(store, query, size);
      setSearchState({
        status: "ready",
        products: response.products,
        searchPhrase: response.searchPhrase,
      });
    } catch {
      setSearchState({ status: "error" });
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="e.g. decor, lamp, rug"
          aria-label={
            store === "amazon"
              ? `Search ${storeLabel} products`
              : `Search ${storeLabel} for ${aestheticLabel} items`
          }
          className={SIDEBAR_SEARCH_INPUT_CLASS}
        />
        <button
          type="submit"
          disabled={!keyword.trim() || searchState.status === "loading"}
          className={SIDEBAR_SEARCH_SUBMIT_CLASS}
        >
          {searchState.status === "loading" ? "Searching..." : "Search"}
        </button>
      </form>

      {searchState.status === "loading" && (
        <SidebarStatusMessage message={`Searching ${storeLabel} products...`} />
      )}

      {searchState.status === "error" && (
        <SidebarStatusMessage
          message={`Unable to search ${storeLabel} products. Please try again.`}
          isError
        />
      )}

      {searchState.status === "ready" && (
        <>
          <IkeaProductResults
            products={searchState.products}
            onProductSelect={onProductSelect}
            emptyMessage={
              searchState.searchPhrase
                ? `No products found for "${searchState.searchPhrase}".`
                : "No products found."
            }
          />
          {searchState.products.length > 0 && (
            <p className="text-center text-xs text-mist/70">More pieces to make it yours ↓</p>
          )}
        </>
      )}
    </div>
  );
}

function buildAestheticSearchQuery(aestheticLabel: string, keyword: string): string {
  return `${aestheticLabel.trim().toLowerCase()} ${keyword.trim()}`;
}
