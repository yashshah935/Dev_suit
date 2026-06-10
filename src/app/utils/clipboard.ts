/**
 * Copy text to the system clipboard.
 * Falls back to execCommand("copy") if navigator.clipboard throws or is unavailable.
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    if (!navigator.clipboard) {
      throw new Error("Clipboard API not available");
    }
    // Attempt standard Clipboard API
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback: Create off-screen textarea
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-99999px";
    textArea.style.top = "-99999px";
    
    // Prevent scrolling parent elements when focusing
    textArea.setAttribute("readonly", "");
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (!successful) {
        throw new Error("execCommand copy returned false");
      }
    } catch (fallbackErr) {
      console.error("Fallback copy failed: ", fallbackErr);
      throw fallbackErr;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}
