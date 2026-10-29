<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Prices and add-ons live only in src/lib/catalog.ts with tests in src/test/catalog.test.ts — one source of truth for totals.
- Community wall reads a separate public `confessions` table filled by a DB trigger from orders, so sender/recipient identity never becomes public.
- No sign-in during build (removed on request): everyone is a guest; orders/profile/swoons live in localStorage (src/lib/guest.ts) and confessions are inserted directly. Signed-in DB code paths remain dormant for later.
- Pitch deck lives at /pitch as an in-app slide route (1920x1080 scaled, ?slide=N); product slide uses real app screenshots in src/assets/shot-*.jpg — retake them when screens change.
- Gift tracking: public `gifts` table holds only open/bite timestamps (no names); recipient names travel in the private gift link URL; read/write only via mark_gift/gift_status RPCs.
- All imagery is realistic vintage storybook oil-painting art (burgundy/gold on aged parchment) generated into src/assets/opt-*.jpg and mapped in src/lib/art.ts (OPT_ART), rendered via src/components/opt-art.tsx — never emoji, pictographs, or flat line-art icons, in the app or the deck. src/components/icons.tsx survives only for pure UI glyphs (check, x). Catalog entries still carry icon name strings asserted by src/test/catalog.test.ts.
