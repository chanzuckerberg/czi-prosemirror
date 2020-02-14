export default function toHtml(serializer, doc) {
  const container = document.createElement('article');
  const serialized = serializer.serializeFragment(doc.content);
  container.appendChild(serialized);
  return container.innerHTML;
}
