import { useEffect } from "react";

// Lightweight SEO manager — avoids adding react-helmet-async as a new
// dependency (Section 64: don't introduce unnecessary dependencies) since
// a small useEffect-based DOM updater covers everything Section 40 asks
// for: title, meta description, canonical URL, Open Graph tags, and
// JSON-LD structured data.
//
// Usage: <Seo title="..." description="..." canonical="..." image="..." structuredData={{...}} />
function Seo({ title, description, canonical, image, structuredData, type = "website" }) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = title;

    const setMeta = (attr, key, content) => {
      if (!content) return null;
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      const created = !tag;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
      return created ? tag : null;
    };

    const createdTags = [];
    const push = (t) => t && createdTags.push(t);

    push(setMeta("name", "description", description));
    push(setMeta("property", "og:title", title));
    push(setMeta("property", "og:description", description));
    push(setMeta("property", "og:type", type));
    push(setMeta("property", "og:image", image));
    push(setMeta("name", "twitter:card", image ? "summary_large_image" : "summary"));
    push(setMeta("name", "twitter:title", title));
    push(setMeta("name", "twitter:description", description));

    let canonicalTag = null;
    let canonicalCreated = false;
    if (canonical) {
      canonicalTag = document.querySelector('link[rel="canonical"]');
      canonicalCreated = !canonicalTag;
      if (!canonicalTag) {
        canonicalTag = document.createElement("link");
        canonicalTag.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute("href", canonical);
      push(setMeta("property", "og:url", canonical));
    }

    let structuredDataTag = null;
    if (structuredData) {
      structuredDataTag = document.createElement("script");
      structuredDataTag.type = "application/ld+json";
      structuredDataTag.textContent = JSON.stringify(structuredData);
      document.head.appendChild(structuredDataTag);
    }

    // Clean up on unmount / navigation away — only remove tags THIS
    // instance created, and restore the previous title.
    return () => {
      document.title = previousTitle;
      createdTags.forEach((t) => t.remove());
      if (canonicalTag && canonicalCreated) canonicalTag.remove();
      if (structuredDataTag) structuredDataTag.remove();
    };
  }, [title, description, canonical, image, type, structuredData]);

  return null;
}

export default Seo;
