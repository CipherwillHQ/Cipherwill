# Notes for LLM

## Types and Interfaces
- Always use `types/interfaces/` directory for TypeScript interfaces
- Import from `@/types/interfaces` for centralized type definitions
- Avoid creating duplicate interfaces - check existing types first

## Coding Guidelines
- **Modular by default** - every function, component, and utility does one thing; extract anything reused more than once into a shared module
- **File size cap** - keep files under 200 lines; if a file is growing past that, it's a signal to split by responsibility
- **Co-locate related files** - component, types, and test live in the same folder
- **No throwaway inline functions** - do not write single-use helper functions inside a file; if logic needs extracting, it goes into a shared global utility module where it can be reused across the codebase


## LLM Readability

- Every file starts with a 2–3 line comment block: what it does, what it owns, what it does NOT do
- Avoid implicit dependencies and ambient globals
- Explicit over clever - code should be readable on first pass without context

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.