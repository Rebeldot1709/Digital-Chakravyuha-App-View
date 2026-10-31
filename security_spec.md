# Digital Chakravyuha Security Specification (ABAC & Zero-Trust)

## 1. Data Invariants
1. **User Identity Invariant**: A user document at `/users/{userId}` can ONLY be read and written by the authenticated user whose `request.auth.uid == userId`.
2. **Sub-collection Master Gate**: Sub-collections `/users/{userId}/securityLogs/{logId}` and `/users/{userId}/customRules/{ruleId}` are bound to the parent user. An authenticated user cannot read or write another user's logs or rules.
3. **Immutability of Core Identifiers**: `userId` and `createdAt` cannot be modified after creation.
4. **No Blanket Queries**: Query lists must always be constrained by user ownership.
5. **Zero-Penetration Axiom**: Security logs must strictly enforce `coreBreached == false`.
6. **Strict Field Validation**: All keys must be allowlisted; ghost fields and unvalidated payloads are unconditionally rejected.

---

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Payload 1 (Ghost Field Injection)**: Attempting to update `users/{userId}` with `{ isAdmin: true, ghostToken: "pwned" }`. -> Expected: PERMISSION_DENIED.
2. **Payload 2 (Cross-User Profile Spoofing)**: Attacker with `uid="bob"` attempting to create or update `users/alice`. -> Expected: PERMISSION_DENIED.
3. **Payload 3 (ID Poisoning Attack)**: Attempting to create document with 10KB string document ID. -> Expected: PERMISSION_DENIED.
4. **Payload 4 (Core Breach Fabrication)**: Writing a security log with `coreBreached: true`. -> Expected: PERMISSION_DENIED.
5. **Payload 5 (Unauthenticated Write)**: Unauthenticated visitor attempting to write to `users/{userId}/securityLogs`. -> Expected: PERMISSION_DENIED.
6. **Payload 6 (Cross-Tenant Log Reading)**: User B attempting to list `/users/UserA/securityLogs`. -> Expected: PERMISSION_DENIED.
7. **Payload 7 (Oversized Payload Exhaustion)**: Writing `attackerPayload` exceeding 2048 characters to exhaust storage. -> Expected: PERMISSION_DENIED.
8. **Payload 8 (Invalid Defense Stance Enum)**: Setting `defenseStance: "GOD_MODE"`. -> Expected: PERMISSION_DENIED.
9. **Payload 9 (Negative Score Tampering)**: Setting `securityScore: -500`. -> Expected: PERMISSION_DENIED.
10. **Payload 10 (Creation Timestamp Forgery)**: Sending client-generated past or future `createdAt` timestamp. -> Expected: PERMISSION_DENIED.
11. **Payload 11 (Rule Action Poisoning)**: Setting `action: "ALLOW_ALL_TRAFFIC"`. -> Expected: PERMISSION_DENIED.
12. **Payload 12 (Target Layer Out-of-Bounds)**: Setting `targetLayer: 99` in custom rules. -> Expected: PERMISSION_DENIED.
