export function generateUniquePID(existingItems: { pid?: string }[] = []): string {
  const existingPids = new Set(
    existingItems.map((item) => item.pid).filter(Boolean)
  );
  let nextId = 1001;
  while (existingPids.has(`PID-${nextId}`) || existingPids.has(`${nextId}`)) {
    nextId++;
  }
  return `PID-${nextId}`;
}
