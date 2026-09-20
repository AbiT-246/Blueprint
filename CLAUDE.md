# CLAUDE.md

## Next.js Agent Notes

@AGENTS.md

---

## Purpose

This repository follows strict engineering standards focused on maintainability, scalability, performance, and readability. Code should prioritize long-term maintainability over short-term convenience.

---

# Code Quality Standards

## General Principles

- Write code that is easy to understand before optimizing.
- Keep methods small, focused, and responsible for a single task.
- Prefer composition over duplication.
- Prioritize readability over clever implementations.
- Every class, method, and file should have a clear responsibility.

---

# Architecture & Design

## Separation of Logic

Business logic should be separated into granular modules appropriate for the framework.

Examples:

- NestJS → Modules + submodules + services
- .NET → Services + repositories + models
- Spring Boot → Packages + services
- Express → Feature folders

Avoid large service classes that contain unrelated responsibilities.

---

## Single Responsibility

Each class should solve one problem.

If a service starts accumulating multiple unrelated responsibilities, split it into smaller services.

---

## Strategy Pattern

When a service contains multiple algorithms where the implementation depends on runtime conditions, move those algorithms into Strategy classes.

Example:

Instead of:

```
IssueAssignmentService

if(type == ROUND_ROBIN){...}
if(type == WORKLOAD){...}
if(type == SKILL){...}
```

Use:

```
RoundRobinStrategy
WorkloadStrategy
SkillStrategy
```

The main service should simply select the appropriate strategy.

---

# Backend Standards

## Models are the Source of Truth

Never create duplicate representations of database entities throughout the application.

Bad:

```
UserInterfaceA
UserInterfaceB
UserInterfaceC
```

If a database column changes, every interface must also change.

Instead:

- Use framework models (DTOs, Models, Entities, etc.) as the central source of truth.
- Reuse these models throughout the application.
- Only project/select the properties needed for a specific operation.

This minimizes maintenance and keeps all database structures synchronized.

---

## Interfaces

Interfaces should only describe temporary data structures.

Use interfaces when:

- Passing data between services
- Method parameters
- Temporary objects
- Request/response contracts
- Data that is NOT persisted

Interfaces act like lightweight models for transient data.

Do **not** recreate database models using interfaces.

---

## Error Handling

Complex backend operations should always consider explicit error handling.

Especially:

- Database operations
- External API calls
- File operations
- Complex workflows

Choose one of three approaches intentionally:

### 1. Catch

Catch the exception and continue execution when appropriate.

### 2. Catch + Throw

Catch the exception, provide a more meaningful error, then throw.

Use this when the workflow must stop.

Example:

```
DatabaseException
↓

throw new Error("Unable to create customer.");
```

### 3. Let it Bubble

If the caller should decide how to handle the error, do not catch it.

---

### Custom Error Messages

When propagating errors upward, provide meaningful messages whenever additional context helps debugging.

---

# Frontend Standards

## Keep Business Logic Out of the Frontend

The frontend should primarily:

- Display data
- Manage UI state
- Handle user interactions

Avoid placing complex logic in frontend code such as:

- Filtering
- Searching
- Aggregation
- Business rules
- Authorization logic

These belong in the backend.

Frontend should consume already-processed data whenever possible.

---

# Database Standards

## Avoid N + 1 Queries

Never perform database queries inside loops.

Bad:

```
Get Users

For each user:
    Query Orders
```

Instead:

- JOIN related tables
- Use eager loading
- Fetch relationships together

---

## Batch Processing

If multiple datasets must be loaded before processing:

- Batch requests
- Execute concurrently where appropriate

Avoid sequential database calls whenever possible.

---

## Index Large Tables

Columns frequently used for:

- WHERE
- JOIN
- ORDER BY
- GROUP BY

should be indexed appropriately on large datasets.

---

## Transactions

If multiple database operations must either all succeed or all fail, wrap them in a database transaction.

Example:

- Create User
- Create Dependents

If either operation fails:

Rollback everything.

---

## Post-Database Operations

Sometimes an operation should only occur after a successful database write.

Example:

- Send notification
- Publish event
- Trigger email

Never perform these operations unless the database operation has succeeded.

Return early if the database operation fails.

---

# API Standards

All API endpoints should require appropriate authentication and authorization.

Examples include:

- JWT
- OAuth
- API Keys
- Session Authentication

Never expose sensitive endpoints publicly.

---

# Code Style

## Avoid `any`

Never use:

```
any
```

(or the language equivalent)

Using unrestricted types removes compile-time safety.

Prefer:

- explicit types
- generics
- interfaces
- models

---

## Private Methods

Private helper methods should appear at the bottom of the file.

Mark methods as private whenever possible.

---

## Remove Duplication

Repeated:

- code
- constants
- configuration
- values

should be extracted into reusable locations.

Follow the DRY principle.

---

## Avoid Magic Numbers

Do not write:

```
if(age > 18)
```

Instead:

```
const LEGAL_AGE = 18;
```

Name important values.

---

## Strict Equality

Always prefer strict equality.

Use:

```
===
```

instead of

```
==
```

Strict equality also checks types and prevents unexpected coercion.

---

# Readability

Long methods should be refactored.

Functions should:

- be easy to read
- have descriptive names
- perform one task
- avoid deep nesting

If a method becomes difficult to scan, extract helper methods.

---

# Performance

Before writing new code, consider:

- unnecessary database queries
- unnecessary object creation
- duplicate computation
- repeated API calls
- repeated loops over the same data

Favor efficient implementations while maintaining readability.

---

# Pull Request Checklist

Before submitting code:

- [ ] Logic is separated into appropriate modules/services.
- [ ] Database models remain the single source of truth.
- [ ] Interfaces are only used for transient data.
- [ ] No unnecessary frontend business logic.
- [ ] No N + 1 queries.
- [ ] Appropriate indexes considered.
- [ ] Transactions used where atomicity is required.
- [ ] Post-database actions only occur after successful writes.
- [ ] API endpoints are authenticated.
- [ ] No `any` types.
- [ ] Private methods are at the bottom.
- [ ] No duplicated code or constants.
- [ ] Errors are handled intentionally.
- [ ] No magic numbers.
- [ ] Strict equality (`===`) is used.
- [ ] Methods remain short, readable, and maintainable.
