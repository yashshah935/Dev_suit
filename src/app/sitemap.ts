import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dev-suit.vercel.app";

  const routes = [
    "",
    "/compare/json-vs-xml",
    "/compare/json-vs-yaml",
    "/compare/mp3-vs-wav",
    "/compare/markdown-vs-html",
    "/guides/base64-encoding",
    "/guides/json-formatting",
    "/guides/xml-validation",
    "/guides/markdown-syntax",
    "/errors/base64-invalid-input",
    "/errors/invalid-xml-character",
    "/errors/json-parse-unexpected-token",
    "/errors/markdown-rendering-issues",
    "/tools/base64-decoder",
    "/tools/base64-encoder",
    "/tools/json-formatter",
    "/tools/json-to-xml",
    "/tools/markdown-parser",
    "/tools/sip-calculator",
    "/tools/speech-to-text",
    "/tools/text-to-speech",
    "/tools/url-decoder",
    "/tools/url-encoder",
    "/tools/xml-to-json",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route.startsWith("/tools/") ? 0.8 : 0.5,
  }));
}
