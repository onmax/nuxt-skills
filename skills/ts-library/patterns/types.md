# Type Patterns

## Utility Types

Common helpers used across libraries:

```typescript
// Promise or sync
export type Awaitable<T> = T | Promise<T>

// Single or array
export type Arrayable<T> = T | T[]

// Nullable
export type Nullable<T> = T | null | undefined

// Deep partial
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Simplify intersection for better IDE display
export type Simplify<T> = { [K in keyof T]: T[K] } & {}

// Prevent inference in specific position
export type NoInfer<T> = [T][T extends any ? 0 : never]
```

## Conditional Extraction

Extract types from structures:

```typescript
// Extract input type from schema
export type Input<T> = T extends { _input: infer U } ? U : unknown

// Extract output type
export type Output<T> = T extends { _output: infer U } ? U : unknown

// Extract from nested property
export type InferContext<T> = T extends { context: infer C } ? C : never
```

## Brand Types

Nominal typing for primitives:

```typescript
declare const brand: unique symbol

export type Brand<T, B> = T & { readonly [brand]: B }

export type UserId = Brand<string, 'UserId'>
export type PostId = Brand<string, 'PostId'>

// Can't mix them up
function getUser(id: UserId) { /* ... */ }
getUser('abc' as UserId)  // OK
getUser('abc' as PostId)  // Error!
```

## Type Accumulation (Builders)

Each method updates generic parameters:

```typescript
interface ProcedureBuilder<TContext, TInput, TOutput> {
  input<T>(schema: T): ProcedureBuilder<TContext, T, TOutput>
  output<T>(schema: T): ProcedureBuilder<TContext, TInput, T>
  query(fn: (opts: { ctx: TContext; input: TInput }) => TOutput): Procedure
}

// Types flow through the chain
const proc = builder
  .input(z.object({ id: z.string() }))  // TInput = { id: string }
  .output(z.object({ name: z.string() })) // TOutput = { name: string }
  .query(({ input }) => ({ name: input.id }))
```

## Module Augmentation

Allow users to extend library types:

```typescript
// Library code
export interface Register {}

export type DefaultError = Register extends { defaultError: infer E }
  ? E
  : Error

// User code
declare module 'my-lib' {
  interface Register {
    defaultError: MyCustomError
  }
}
```

## Data Tagging

Attach type metadata with symbols:

```typescript
declare const dataTagSymbol: unique symbol
declare const errorTagSymbol: unique symbol

export type DataTag<TType, TData, TError> = TType & {
  [dataTagSymbol]: TData
  [errorTagSymbol]: TError
}

// Extract tagged types
export type InferData<T> = T extends { [dataTagSymbol]: infer D } ? D : unknown
```

## Mapped Type Modifications

Column builder pattern (drizzle):

```typescript
type NotNull<T extends ColumnBuilder> = T & { _: { notNull: true } }
type HasDefault<T extends ColumnBuilder> = T & { _: { hasDefault: true } }

class ColumnBuilder<T extends ColumnConfig> {
  notNull(): NotNull<this> {
    // ...
    return this as NotNull<this>
  }

  default(value: T['data']): HasDefault<this> {
    // ...
    return this as HasDefault<this>
  }
}
```

## Compile-Time Errors

Return readable error messages:

```typescript
type TypeError<Message extends string> = { __error: Message }

type ValidateInput<T> = T extends string
  ? T
  : TypeError<'Input must be a string'>

// Shows: Type 'TypeError<"Input must be a string">' is not assignable...
```

## Function Overloads

Multiple signatures for different inputs:

```typescript
export function useEventListener<E extends keyof WindowEventMap>(
  event: E,
  listener: (ev: WindowEventMap[E]) => any
): void

export function useEventListener<E extends keyof DocumentEventMap>(
  target: Document,
  event: E,
  listener: (ev: DocumentEventMap[E]) => any
): void

export function useEventListener(...args: any[]) {
  // Implementation
}
```

## Distributive Conditionals

Apply to each union member:

```typescript
type ToArray<T> = T extends any ? T[] : never

type Result = ToArray<string | number>
// Result = string[] | number[]
```

Disable distribution with tuple:

```typescript
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never

type Result = ToArrayNonDist<string | number>
// Result = (string | number)[]
```
