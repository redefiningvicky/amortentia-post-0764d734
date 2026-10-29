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
- Sign-in is optional during build: guests keep orders/profile/swoons in localStorage (src/lib/guest.ts) and may insert confessions directly; signed-in users use the database.
