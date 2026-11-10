import { describe, expect, it } from 'vitest';

import { groupNavItems } from '../nav';

describe('groupNavItems', () => {
  it('splits simple links from groups with children', () => {
    const { quickLinks, groups } = groupNavItems([
      { text: 'خانه' },
      { text: 'طراحی', children: [{ text: 'اتاق خواب' }] },
      { text: 'وبلاگ' },
    ]);

    expect(quickLinks.map((item) => (item as any).text)).toEqual([
      'خانه',
      'وبلاگ',
    ]);
    expect(groups).toHaveLength(1);
  });

  it('keeps a group with an empty children array as a quick link', () => {
    const { quickLinks, groups } = groupNavItems([
      { text: 'تماس', children: [] },
    ]);

    expect(groups).toHaveLength(0);
    expect(quickLinks).toHaveLength(1);
  });

  it('handles missing input', () => {
    expect(groupNavItems()).toEqual({ quickLinks: [], groups: [] });
  });
});
