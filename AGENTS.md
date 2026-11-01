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
- Standalone guest confessions use the same public wall with a `confession` tier marker and no identity fields, so posting does not require an order. Generated album examples stay separate from customer uploads and are explicitly labeled, to avoid fabricated social proof.
- Spell bundle matching, prices and best non-stacking discounts are derived in the catalog, so displayed offers and order totals agree.
- Discover and Spellbook are public browsing routes; validated Send search parameters carry catalog selections into the seven-step order flow without duplicating product data.
- Brew My Own (cauldron class) brews from raw INGREDIENTS (raw-* IDs, priced, never free); the Potion Cabinet uses bottled POTIONS. Both resolve through findBrewable in catalog.ts, so blendOutcome and potionsTotal accept either ID type in Spellbook, Send, and Wall.
- Live potion results derive from canonical catalogue IDs through livePotionResult in catalog.ts and one shared PotionResultCard; keep cabinet and raw selections separate, and save optional versioned result snapshots alongside recipe IDs without migrating existing guest orders.
- No sign-in during build (removed on request): everyone is a guest; orders/profile/swoons live in localStorage (src/lib/guest.ts) and confessions are inserted directly. Signed-in DB code paths remain dormant for later.
- Pitch deck lives at /pitch as an in-app slide route (1920x1080 scaled, ?slide=N); product slide uses real app screenshots in src/assets/shot-* (bundled images or CDN asset pointers) — retake them when screens change.
- Gift tracking: public `gifts` table holds only open/bite timestamps (no names); recipient names travel in the private gift link URL; read/write only via mark_gift/gift_status RPCs.
- All imagery is realistic vintage storybook oil-painting art (burgundy/gold on aged parchment) generated into src/assets/opt-*.jpg and mapped in src/lib/art.ts (OPT_ART), rendered via src/components/opt-art.tsx — never emoji, pictographs, or flat line-art icons, in the app or the deck. src/components/icons.tsx survives only for pure UI glyphs (check, x). Catalog entries still carry icon name strings asserted by src/test/catalog.test.ts.


## Fictional Wall
The Wall is a gag experience using only the 13 fictional confessions in src/lib/wall-demo.ts and 16 bundled sample photos. This supersedes earlier database-backed Wall instructions. Never read customer confessions, photo uploads, or old database caches into this UI. Posting and order sharing are pretend interactions kept only in sessionStorage; pinning uses built-in photos for the current visit, with no uploads. Send must set share_on_wall to false and must not insert confessions in the database. Preserve five-confession/six-photo paging and the shared ShowMore spacing.
