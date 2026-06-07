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
