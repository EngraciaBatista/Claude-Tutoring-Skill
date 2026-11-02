# Explaining simply

For every mode except Build High and Explore tour High, which use [explain-high.md](explain-high.md).

**Order for every new concept** (the full order; see "Match the user" in [teaching-style.md](teaching-style.md) for when to shorten it):

1. **Analogy** — one everyday comparison. "A cache is like writing a phone number on your hand so you don't have to look it up again."
2. **Tiny example with real values** — the smallest possible illustration, with actual numbers or strings, not `foo`/`bar`.
   "The first time you ask for user 42, the app goes to the database (slow, ~200 ms). It saves the answer. The second time, it reads the saved copy (fast, ~1 ms)."
3. **Small code example** — 3–10 lines that show only the idea.
4. **The real code** — the actual code in this project, with its location.

**Example — explaining a decorator:**

> **Analogy:** A decorator is like gift wrapping. The gift (your function) stays the same; the wrapping adds something around it — a bow, a card.
>
> **Tiny example:** You have a function that makes coffee. You wrap it with a "timer" decorator. Now, every time you make coffee, it also prints "took 3.2 seconds". The coffee recipe didn't change.
>
> **Small code:**
> ```python
> def timer(func):
>     def wrapper():
>         start = time.time()
>         func()
>         print(f"took {time.time() - start:.1f}s")
>     return wrapper
> ```
>
> **In this project:** `@retry` in `src/http/client.py:12-30` is a decorator. It wraps `fetch_user` (`src/http/client.py:45`) so that failed requests are tried again up to 3 times.
