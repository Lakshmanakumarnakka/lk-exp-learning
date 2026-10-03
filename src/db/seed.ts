import { db } from "@/db";
import { challenges, type NewChallenge } from "@/db/schema";
import { sql } from "drizzle-orm";

function dayOffset(offset: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

const SEED: NewChallenge[] = [
  {
    slug: "two-sum-sorted",
    title: "Two Sum, Sorted",
    summary: "Find the pair that hits the target inside a sorted list — in a single pass.",
    description:
      "You are given a sorted list of integers and a target value. Exactly one pair of numbers in the list adds up to the target. Return the 0-based indices `[i, j]` with `i < j`.\n\nBecause the input is sorted, a brute-force double loop is wasted motion. Start one pointer at each end of the list and let the current sum tell you which pointer to move: too small means the left pointer steps right, too large means the right pointer steps left.\n\nHint: the two-pointer invariant eliminates one index per step, which is exactly why the algorithm runs in O(n).",
    difficulty: "easy",
    language: "Python",
    xp: 50,
    estimatedMinutes: 10,
    tags: ["arrays", "two-pointers", "algorithms"],
    constraints: [
      "2 ≤ len(nums) ≤ 10^4",
      "-10^6 ≤ nums[i], target ≤ 10^6",
      "nums is sorted in ascending order",
      "Exactly one valid pair exists",
      "O(n) time, O(1) extra space",
    ],
    examples: [
      {
        input: "nums = [1, 2, 4, 7, 11], target = 9",
        output: "[1, 3]",
        explanation: "nums[1] + nums[3] = 2 + 7 = 9",
      },
      {
        input: "nums = [-3, 0, 3, 10], target = 0",
        output: "[0, 2]",
      },
    ],
    starterCode: `def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    """Return the 0-based indices [i, j] of the pair that sums to target."""
    # your code here
    pass
`,
    expectedTokens: ["while"],
    testCases: [
      { name: "finds the pair", code: "assert two_sum_sorted([1, 2, 4, 7, 11], 9) == [1, 3]" },
      { name: "handles negatives", code: "assert two_sum_sorted([-3, 0, 3, 10], 0) == [0, 2]" },
      { name: "pair at the edges", code: "assert two_sum_sorted([1, 5, 9], 10) == [0, 2]" },
      { name: "long list stays linear", code: "assert two_sum_sorted(list(range(10_000)), 19_997) == [9998, 9999]" },
    ],
    publishDate: dayOffset(-6),
  },
  {
    slug: "deep-freeze",
    title: "Deep Freeze",
    summary: "Recursively freeze an object graph until nothing can ever mutate again.",
    description:
      "`Object.freeze` is famously shallow: it locks the top-level object but leaves every nested object and array wide open. Today's challenge is to fix that.\n\nImplement `deepFreeze(obj)` so the object it returns — and every object, array, function value, or date reachable from it — is frozen. The function must be safe on cyclic references (a frozen object graph may point back at itself) and must return the same object it was given.\n\nHint: a `WeakSet` of already-visited values turns an infinite recursion into a quick lookup.",
    difficulty: "easy",
    language: "JavaScript",
    xp: 75,
    estimatedMinutes: 15,
    tags: ["javascript", "recursion", "immutability"],
    constraints: [
      "Do not freeze primitives (they are already immutable)",
      "Handle cyclic object graphs without blowing the stack",
      "Freeze arrays, nested objects, and object-valued properties",
      "Return the original object, frozen",
    ],
    examples: [
      {
        input: 'deepFreeze({ db: { host: "localhost" } })',
        output: "Object.isFrozen(cfg.db) === true",
      },
      {
        input: "a.self = a; deepFreeze(a)",
        output: "Object.isFrozen(a.self) === true",
      },
    ],
    starterCode: `function deepFreeze(obj) {
  // recursively freeze obj and everything it reaches
  // return the same (now frozen) object
}
`,
    expectedTokens: ["Object.freeze"],
    testCases: [
      { name: "freezes the root", code: "Object.isFrozen(state)" },
      { name: "freezes nested objects", code: "Object.isFrozen(state.auth) && Object.isFrozen(state.auth.tokens)" },
      { name: "freezes arrays inside", code: "Object.isFrozen(state.history)" },
      { name: "survives cycles", code: "state.self === state && Object.isFreezeSafe(state)" },
    ],
    publishDate: dayOffset(-5),
  },
  {
    slug: "squeeze-the-lighthouse",
    title: "Squeeze the Lighthouse",
    summary: "Center a dialog dead-center of the viewport with modern CSS — no absolute hacks.",
    description:
      "Design systems live and die by the dialog. Yours must sit perfectly centered in the viewport, stay centered while content grows, and cap itself at the smaller of `min(92vw, 560px)` wide and `80vh` tall.\n\nWrite the CSS for `.overlay` (the full-viewport backdrop) and `.dialog` (the panel) using modern layout primitives. No negative margins, no translate arithmetic, no JavaScript measuring.\n\nHint: one line of CSS Grid on the overlay does the entire centering job.",
    difficulty: "easy",
    language: "CSS",
    xp: 50,
    estimatedMinutes: 10,
    tags: ["css", "layout", "grid", "design-systems"],
    constraints: [
      "Overlay covers the entire viewport and dims the page",
      "Dialog never exceeds 92vw or 560px wide",
      "Dialog never exceeds 80vh tall and scrolls internally",
      "No position: absolute on the dialog",
    ],
    examples: [
      { input: "viewport 1440×900", output: "dialog centered, 560px wide" },
      { input: "viewport 375×667 with overflowing content", output: "dialog 345px wide, internal scroll" },
    ],
    starterCode: `.overlay {
  /* full-viewport backdrop, centers its only child */
}

.dialog {
  /* width: min(92vw, 560px); max-height: 80vh; internal scroll */
}
`,
    expectedTokens: ["place-items"],
    testCases: [
      { name: "overlay is a grid", code: "getComputedStyle(overlay).display === 'grid'" },
      { name: "centers its children", code: "getComputedStyle(overlay).placeItems === 'center'" },
      { name: "dialog caps width", code: "dialog.offsetWidth <= 560" },
      { name: "dialog scrolls internally", code: "dialog.scrollHeight > 0 && dialog.clientHeight <= vh(80)" },
    ],
    publishDate: dayOffset(-4),
  },
  {
    slug: "debounce-the-feed",
    title: "Debounce the Feed",
    summary: "Stop the search box from hammering your API on every keystroke.",
    description:
      "A live search input fires on every keystroke; your backend files a missing-person report for the network tab. Implement `debounce(fn, wait)` in TypeScript.\n\nThe returned function must postpone `fn` until `wait` milliseconds have passed with no new calls. It must support a `.cancel()` method, preserve the caller's `this`, keep full generic typing of the wrapped function's arguments, and only ever invoke the trailing call with the latest arguments.\n\nHint: the entire behavior is a timer that you clear and restart — the trick is cleaning it up reliably.",
    difficulty: "medium",
    language: "TypeScript",
    xp: 150,
    estimatedMinutes: 20,
    tags: ["typescript", "functions", "timers", "performance"],
    constraints: [
      "Generic over the wrapped function's parameter tuple",
      "Trailing-edge invocation with the latest arguments",
      "Expose .cancel() that drops a pending call",
      "No arguments object, no any",
    ],
    examples: [
      {
        input: 'debounce(save, 300) called at t=0, t=100, t=200',
        output: "save runs once, at t=500",
      },
      {
        input: "d.cancel() at t=250",
        output: "save never runs",
      },
    ],
    starterCode: `export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
) {
  // return a debounced wrapper with a .cancel() method
}
`,
    expectedTokens: ["setTimeout", "clearTimeout"],
    testCases: [
      { name: "collapses bursts", code: "calls === 1 after 3 rapid invocations" },
      { name: "uses latest arguments", code: "lastArg === 'query #3'" },
      { name: "cancel stops the call", code: "d.cancel(); calls === 0" },
      { name: "preserves this", code: "ctx.invoked === true" },
    ],
    publishDate: dayOffset(-3),
  },
  {
    slug: "top-streak-per-user",
    title: "Top Streak per User",
    summary: "One SQL query that finds every user's longest daily solving streak.",
    description:
      "The `activity` table records one row per solved challenge: `(user_id, solved_on)`. Some users solve twice a day, some skip weekends. Compute each user's longest streak of consecutive calendar days.\n\nThe classic trick is the islands pattern: subtract `ROW_NUMBER()` from the date to bucket consecutive days into groups, then aggregate per group.\n\nReturn one row per user: `user_id`, `longest_streak`, ordered by streak length descending.",
    difficulty: "medium",
    language: "SQL",
    xp: 175,
    estimatedMinutes: 25,
    tags: ["sql", "window-functions", "analytics"],
    constraints: [
      "Same-day duplicates count once (DISTINCT the days first)",
      "A streak breaks on any missing calendar day",
      "Users with one active day have a streak of 1",
      "Output ordered by longest_streak desc, then user_id asc",
    ],
    examples: [
      {
        input: "alice active on 2026-01-01..03 and 2026-01-05",
        output: "(alice, 3)",
      },
      {
        input: "bob active only on 2026-01-02 (twice)",
        output: "(bob, 1)",
      },
    ],
    starterCode: `-- activity(user_id, solved_on)
-- return: user_id, longest_streak
WITH days AS (
  -- one row per user per distinct day
)
SELECT ... ;
`,
    expectedTokens: ["row_number", "over"],
    testCases: [
      { name: "finds the longest island", code: "alice → 3, not 4" },
      { name: "dedupes same-day activity", code: "bob → 1" },
      { name: "orders the leaderboard", code: "first row has max(longest_streak)" },
    ],
    publishDate: dayOffset(-2),
  },
  {
    slug: "stale-closure-hunt",
    title: "Stale Closure Hunt",
    summary: "Why is this interval ticking with last month's state? Find and fix the stale closure.",
    description:
      "A polling component refetches every 5 seconds — except its effect closure captured the query params from the very first render, so changing the filter never changes what gets fetched. Classic.\n\nRefactor `usePoll(callback, interval)` so the interval always invokes the most recent callback without resetting the timer on every render. The hook must clean up on unmount and expose `stop()` / `start()`.\n\nHint: keep the latest callback in a ref and let the effect depend only on the interval.",
    difficulty: "medium",
    language: "TypeScript",
    xp: 175,
    estimatedMinutes: 25,
    tags: ["react", "hooks", "closures", "state"],
    constraints: [
      "Changing the callback never resets the interval",
      "Changing the interval reschedules cleanly",
      "No lint-disabling of exhaustive-deps",
      "Timer is cleared on unmount",
    ],
    examples: [
      {
        input: "filter changes 'open' → 'closed' at t=12s",
        output: "next tick fetches 'closed'",
      },
      { input: "unmount at t=20s", output: "no further invocations" },
    ],
    starterCode: `import { useEffect, useRef } from "react";

export function usePoll(callback: () => void, interval: number) {
  // always call the latest callback on a stable interval
  // return { start, stop }
}
`,
    expectedTokens: ["useRef", "useEffect"],
    testCases: [
      { name: "invokes latest callback", code: "tick() sees updated filter" },
      { name: "interval not reset by renders", code: "timers.length === 1 across rerenders" },
      { name: "cleans up on unmount", code: "clearInterval called once" },
    ],
    publishDate: dayOffset(-1),
  },
  {
    slug: "rate-limit-the-rush",
    title: "Rate Limit the Rush",
    summary: "Token bucket, from scratch, in Go — goroutines welcome.",
    description:
      "Your webhook endpoint melts at every deploy. Build a goroutine-safe token bucket: capacity `n`, refills one token per `rate` interval, and every request must either take a token or be rejected immediately — no sleeping.\n\nImplement `NewLimiter(capacity int, rate time.Duration)` with `Allow() bool`. The struct must be safe under concurrent `Allow()` calls from thousands of goroutines and must not leak timers or spawn a goroutine per request.\n\nHint: lazy refill — compute elapsed time on each call instead of running a background ticker.",
    difficulty: "hard",
    language: "Go",
    xp: 300,
    estimatedMinutes: 35,
    tags: ["go", "concurrency", "systems"],
    constraints: [
      "Allow() never blocks",
      "Safe for concurrent use (run with -race)",
      "No goroutine or ticker per request",
      "Bucket starts full",
    ],
    examples: [
      {
        input: "capacity=3, 5 calls at t=0",
        output: "3 allowed, 2 rejected",
      },
      {
        input: "capacity=3, rate=100ms, call at t=+250ms",
        output: "allowed (2 tokens refilled)",
      },
    ],
    starterCode: `package ratelimit

import "sync"

type Limiter struct {
	mu sync.Mutex
	// tokens, capacity, rate, last refill...
}

func NewLimiter(capacity int, rate time.Duration) *Limiter {
	// bucket starts full
}

func (l *Limiter) Allow() bool {
	// refill lazily, then take a token or reject
}
`,
    expectedTokens: ["time."],
    testCases: [
      { name: "starts full", code: "3 of 3 initial calls allowed" },
      { name: "rejects when empty", code: "call #4 rejected" },
      { name: "refills over time", code: "call at t+250ms allowed" },
      { name: "race detector clean", code: "go test -race → PASS" },
    ],
    publishDate: dayOffset(0),
  },
  {
    slug: "lru-under-pressure",
    title: "LRU Under Pressure",
    summary: "O(1) get and put for a cache that forgets exactly the right thing.",
    description:
      "Design `LRUCache(capacity)`: `get(key)` returns the value or -1, `put(key, value)` inserts or updates. When capacity is exceeded, evict the least recently used key. Both operations must be O(1) — no scanning, no sorting.\n\nThe canonical answer is a hash map plus a doubly linked list where the most recent key sits at the head. A clever shortcut (an order-preserving dict) is acceptable for the daily, but write it like you mean it.\n\nHint: every access — read or write — is a move-to-front operation.",
    difficulty: "hard",
    language: "Python",
    xp: 300,
    estimatedMinutes: 35,
    tags: ["python", "data-structures", "caching"],
    constraints: [
      "1 ≤ capacity ≤ 3000",
      "get and put are O(1)",
      "put on an existing key refreshes recency",
      "get returns -1 for missing keys",
    ],
    examples: [
      {
        input: "put(1,1) put(2,2) get(1) put(3,3) get(2)",
        output: "1, then -1 (2 was evicted)",
      },
      {
        input: "capacity=1, put(1,1) put(2,2) get(1)",
        output: "-1",
      },
    ],
    starterCode: `class LRUCache:
    def __init__(self, capacity: int):
        pass

    def get(self, key: int) -> int:
        pass

    def put(self, key: int, value: int) -> None:
        pass
`,
    expectedTokens: ["popitem", "OrderedDict"],
    testCases: [
      { name: "evicts the least recent", code: "get(2) == -1 after put(3,3)" },
      { name: "get refreshes recency", code: "get(1); put(3,3) keeps key 1" },
      { name: "update refreshes too", code: "put(2,9); evict order changes" },
      { name: "capacity one works", code: "single-slot cache evicts on every put" },
    ],
    publishDate: dayOffset(1),
  },
  {
    slug: "typed-event-emitter",
    title: "Typed Event Emitter",
    summary: "An event bus where the compiler knows every payload. Zero runtime surprises.",
    description:
      "Stringly-typed events are how 'user:updatd' makes it to production. Build a `TypedEmitter<Events>` where `Events` maps event names to payload types, and `on`, `off`, and `emit` are fully typed: wrong event name? compile error. Wrong payload? compile error.\n\nRuntime behavior: multiple listeners per event, `off` removes the exact listener, `emit` invokes in subscription order, and unsubscribing must not corrupt in-flight emissions.\n\nHint: `Record<keyof Events, Set<fn>>` gets you 90% of the way; mapped types do the rest.",
    difficulty: "expert",
    language: "TypeScript",
    xp: 500,
    estimatedMinutes: 45,
    tags: ["typescript", "generics", "type-level", "events"],
    constraints: [
      "emit('nope') must fail to compile",
      "Payload types flow into listeners automatically",
      "off() during emit() must not skip listeners",
      "No any, no as-casts in the public API",
    ],
    examples: [
      {
        input: "emitter.on('login', (user) => ...)",
        output: "user: { id: string } — inferred",
      },
      {
        input: "emitter.emit('login', 42)",
        output: "type error ✓",
      },
    ],
    starterCode: `type EventMap = Record<string, unknown>;

export class TypedEmitter<Events extends EventMap> {
  // on<K extends keyof Events>(event: K, fn: (payload: Events[K]) => void): () => void
  // off, emit...
}
`,
    expectedTokens: ["Record", "keyof"],
    testCases: [
      { name: "listeners fire in order", code: "order === [first, second]" },
      { name: "off removes one listener", code: "remaining listener still fires" },
      { name: "emit during off is safe", code: "no skipped listeners" },
      { name: "compiles strictly", code: "tsc --noEmit passes with no any" },
    ],
    publishDate: dayOffset(2),
  },
  {
    slug: "fold-the-intervals",
    title: "Fold the Intervals",
    summary: "Merge overlapping time ranges until none of them touch. Borrow-checker approved.",
    description:
      "Given a `Vec<(i64, i64)>` of half-open intervals `[start, end)`, return the smallest list of disjoint, sorted intervals covering exactly the same time.\n\nThe algorithm is one sort and one left fold: order by start, keep a current interval in the accumulator, and either extend it (if the next interval overlaps) or flush it and start a new one.\n\nEmpty input returns an empty vector. Do it with iterators — `sort_unstable` plus `fold` — for the full idiomatic shine.",
    difficulty: "hard",
    language: "Rust",
    xp: 300,
    estimatedMinutes: 30,
    tags: ["rust", "iterators", "algorithms"],
    constraints: [
      "start < end for every input interval",
      "Half-open semantics: (0,5) and (5,9) can merge",
      "O(n log n) time, from sorting",
      "Input vector may be mutated or consumed",
    ],
    examples: [
      {
        input: "[(1,3),(2,6),(8,10),(15,18)]",
        output: "[(1,6),(8,10),(15,18)]",
      },
      { input: "[(1,4),(4,5)]", output: "[(1,5)]" },
    ],
    starterCode: `pub fn merge_intervals(mut intervals: Vec<(i64, i64)>) -> Vec<(i64, i64)> {
    // sort, then fold the vec into disjoint ranges
    todo!()
}
`,
    expectedTokens: ["sort", "fold"],
    testCases: [
      { name: "merges overlaps", code: "assert_eq!(merge(vec![(1,3),(2,6)]), vec![(1,6)])" },
      { name: "merges touching ranges", code: "assert_eq!(merge(vec![(1,4),(4,5)]), vec![(1,5)])" },
      { name: "empty stays empty", code: "assert!(merge(vec![]).is_empty())" },
      { name: "nested interval swallowed", code: "assert_eq!(merge(vec![(0,10),(2,3)]), vec![(0,10)])" },
    ],
    publishDate: dayOffset(3),
  },
];

let seeded = false;

export async function ensureSeeded() {
  if (seeded) return;
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(challenges);
  if ((row?.count ?? 0) > 0) {
    seeded = true;
    return;
  }
  await db.insert(challenges).values(SEED);
  seeded = true;
}
