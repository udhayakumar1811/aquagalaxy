// Shared wishlist helpers.
//
// Native "storage" events only fire in OTHER browser tabs, not the tab that
// made the change — that's why this app used to poll localStorage every
// 500ms in the Navbar to keep the wishlist count in sync. That's wasteful
// (it runs forever, on every page, whether or not anything changed).
//
// Instead, every place that modifies the wishlist should go through
// getWishlist()/setWishlist() here, which dispatches a custom
// "wishlistUpdated" event. Any component (e.g. the Navbar badge) can just
// listen for that event instead of polling.

const WISHLIST_KEY = "wishlist";
const WISHLIST_EVENT = "wishlistUpdated";

export const getWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
};

export const setWishlist = (items) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: items }));
};

export const WISHLIST_UPDATED_EVENT = WISHLIST_EVENT;
