# Vulnix Blog

The editorial site for [Vulnix](https://vulnix.dev), publishing practical
security research and field notes on penetration testing, exploit validation,
and application security.

## Contributing

Articles are Markdown files in `content/posts/`. The filename becomes the
article URL under `/insights/`; add complete frontmatter and keep the writing
accurate, evidence-led, and useful to security practitioners.

For local development:

```bash
npm install
npm run dev
```

## Design

The blog shares vulnix.dev's look. Its header (`components/site-header.tsx`),
footer (`components/site-footer.tsx`), the `mk-*` colour tokens in
`app/globals.css` and the article cards are copied from the product's
marketing site (`apps/web/components/marketing/` in the Vulnix repo), with
links pointed at vulnix.dev. When the product's marketing design changes,
port the change here. The blog is dark only for now; it has no light theme
or theme toggle.

Before opening a pull request, run:

```bash
npm run lint
npm run typecheck
```

<p align="center">
  <a href="https://vulnix.dev"><strong>vulnix.dev</strong></a> &middot;
  <a href="https://blog.vulnix.dev">blog.vulnix.dev</a>
</p>
