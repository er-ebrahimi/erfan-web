export type NavGroupItem = {
  children?: unknown[] | null;
};

/**
 * The mega menu shows each top-level group with children as a column, and the
 * remaining links as a quick-links column.
 */
export function groupNavItems<T extends NavGroupItem>(items: T[] = []) {
  return {
    quickLinks: items.filter((item) => !item.children?.length),
    groups: items.filter((item) => Boolean(item.children?.length)),
  };
}
