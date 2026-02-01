const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const urlRegex = /(https?:\/\/[^\s]+)/g;

const linkify = (text: string): string => {
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
};

export const textToEmailHtml = (text: string): string => {
  const escaped = escapeHtml(text);
  const linked = linkify(escaped);

  return `<p>${linked.replace(/\n/g, "<br />")}</p>`;
};

export const emptyToUndefined = (value: string | undefined | null): string | undefined => {
  if (!value || value.trim() === "") {
    return undefined;
  }
  return value;
};