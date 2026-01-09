# RTL Support Implementation

This document describes the Right-to-Left (RTL) support implementation for the `Cons` component and potentially other components in this directory.

## Implementation Details

The component supports multilingual layouts (LTR and RTL) by leveraging the HTML `dir` attribute and standard Flexbox behavior.

### Key Principles

1.  **`dir` Attribute**: The component explicitly sets the `dir` attribute (`dir="rtl"` or `dir="ltr"`) on its root container based on the provided `locale` prop.
    -   Locales `fa` (Persian) and `ar` (Arabic) trigger `dir="rtl"`.
    -   Other locales default to `dir="ltr"`.

2.  **Flexbox Layout**:
    -   We use standard `flex-row` (the default `flex` direction) for both LTR and RTL.
    -   When `dir="rtl"` is active, `flex-row` automatically lays out items from Right to Left.
        -   **Item 1 (Icon)**: Placed on the Right.
        -   **Item 2 (Content)**: Placed on the Left.
    -   **Avoid `flex-row-reverse`**: We do NOT use `flex-row-reverse` for RTL, as it would flip the visual order (L->R), placing the icon on the Left, which is incorrect for a bullet-point style list in RTL.

3.  **Text Alignment**:
    -   We explicitly switch between `text-right` (for RTL) and `text-left` (for LTR) to ensure text content aligns correctly within its container.

4.  **Responsiveness**:
    -   Margins and paddings are responsive (`md:` prefixes) to ensure good layout on mobile and desktop.
    -   Icons are aligned `items-start` to handle multi-line text gracefully.

## Verification

A test page is available at `/test-rtl` (e.g., `http://localhost:3000/en/test-rtl`) to visually verify the behavior in both English and Persian.

### Checklist for Future Changes

-   [ ] Ensure `dir` attribute is correctly derived from `locale`.
-   [ ] Do not use `flex-row-reverse` unless you specifically want to invert the natural reading order.
-   [ ] Check icon positioning on mobile devices.
-   [ ] Verify text alignment matches the language direction.
