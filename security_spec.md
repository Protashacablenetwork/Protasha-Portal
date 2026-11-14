# Firestore Security Specification

## 1. Data Invariants
1. Every document ID across all collections must match `^[a-zA-Z0-9_\-]+$` and be at most 128 characters to prevent path/ID poisoning.
2. Every transaction (`transactions` and `ay_byay_transactions`) must have `id` (string), `type` (`"income"` or `"expense"`), and finite numeric `amount`.
3. Every banner ad (`banners`) must have `id` (string), `imageUrl` (string <= 900,000 chars), and boolean `isActive`.
4. Every payment channel (`channels`) must have `id`, `name`, `labelBn`, and `labelEn` as bounded strings.
5. Every staff account (`staff`) must have `id`, `name`, `phone`, and bounded `transactions` array (`<= 500` items).
6. Every salary payment (`ay_byay_salaries` / `staff_salaries`) must have `id`, `staffId`, `month`, numeric `baseSalary`/`netSalary`, and `paymentStatus` in `["paid", "pending"]`.
7. Every Quick Hisab owner (`quick_hisab_owners`) must have `id`, `name`, and numeric `shareUnits`.
8. Every app user (`users`) must have `id`, `name`, `phone`, `role` in `["admin", "sub-admin", "user", "visitor"]`, and `status` in `["active", "suspended"]`.
9. Every inventory item (`ay_byay_inventory`) and log (`ay_byay_inventory_logs`) must enforce bounded strings, valid enums (`["in", "out", "return", "damaged"]`), and numeric quantities/costs.
10. Unknown collections and paths are rejected by the default-deny catch-all rule (`match /{document=**} { allow read, write: if false; }`).

## 2. The "Dirty Dozen" Rejected Payloads
1. **Unprotected Unknown Collection Write**: Writing `{ "foo": "bar" }` to `/rogue_collection/doc1` -> Denied by default-deny catch-all.
2. **Oversized Document ID Poisoning**: Creating `/banners/<150-char-id>` or ID with `/` or `$` -> Denied by `isValidId()`.
3. **Invalid Transaction Type**: Creating `/transactions/trx-1` with `{ "id": "trx-1", "type": "hacked", "amount": 500 }` -> Denied by `type in ['income', 'expense']`.
4. **Non-Numeric Transaction Amount**: Creating `/ay_byay_transactions/TXN-1` with `{ "id": "TXN-1", "type": "income", "amount": "500" }` -> Denied by `amount is number`.
5. **Shadow Field Injection on Banner**: Creating `/banners/b-1` with `{ "id": "b-1", "imageUrl": "https://...", "isActive": true, "evilAdminFlag": true }` -> Denied by `keys().hasOnly(...)`.
6. **Non-Boolean Banner `isActive`**: Updating `/banners/b-1` with `isActive: "true"` -> Denied by `isActive is bool`.
7. **Invalid Salary Payment Status**: Creating `/ay_byay_salaries/sal-1` with `paymentStatus: "cancelled"` -> Denied by `paymentStatus in ['paid', 'pending']`.
8. **Invalid User Role Escalation Value**: Creating `/users/u-1` with `role: "superroot"` -> Denied by `role in ['admin', 'sub-admin', 'user', 'visitor']`.
9. **Oversized Base64 Payload (>900KB)**: Writing `imageUrl` of length `> 900000` -> Denied by `.size() <= 900000`.
10. **Unbounded Staff Transactions Array**: Writing `staff` doc with `transactions.size() > 500` -> Denied by `transactions.size() <= 500`.
11. **Invalid Inventory Movement Type**: Creating `/ay_byay_inventory_logs/LOG-1` with `type: "steal"` -> Denied by `type in ['in', 'out', 'return', 'damaged']`.
12. **Shadow Field Injection on Quick Hisab Owner**: Creating `/quick_hisab_owners/o-1` with `{ "id": "o-1", "name": "X", "shareUnits": 1, "secret": 123 }` -> Denied by `keys().hasOnly(...)`.
