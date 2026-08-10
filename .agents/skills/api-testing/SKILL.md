---
name: api-testing
description: >
  Writes API specs and Zod contracts for HTTP endpoints. Use when testing an
  endpoint, adding or updating a schema, or when a response shape changed and
  the strict contract must be re-verified.
---

# API specs with strict contracts

## Context
Every response body passes through a `z.strictObject` schema in
`fixtures/api/schemas/{area}/`. The strictness is the feature: a new unmapped
field from the backend fails the parse, which is exactly the alert we want.

## Recipe
1. Call the real endpoint first (curl or the apiRequest fixture in a scratch
   run) and read the actual JSON. Never write a schema from documentation alone.
2. Model the schema with `z.strictObject`, tightest types that hold: enums for
   closed sets, `.regex()` for id shapes, `.positive()` for money.
3. Derive the type: `export type X = z.output<typeof XSchema>;`. No manually
   written interfaces for API payloads.
4. In the spec: `apiRequest` fixture, assert status, then
   `Schema.parse(await response.json())`, then business assertions on the
   parsed, typed value.
5. API specs opt out of browser auth state with
   `test.use({ storageState: { cookies: [], origins: [] } })` unless the
   endpoint needs a session.
6. Run the spec. A parse failure means the contract moved: update the schema
   deliberately, never loosen it to `z.object`.

## Error handling
- Parse error listing an unrecognized key: that is the guardrail working.
  Investigate the backend change before touching the schema.
- Optional fields: model reality (`.optional()`), do not mark everything
  optional to make errors go away.

## Example
`const data = OrdersResponseSchema.parse(await response.json());`
