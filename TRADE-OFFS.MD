# Conscious  Design Decisions and Compromises

## The project was developed as part of a recruitment challenge with a time limit of a few hours. Some simplifications were made, while still maintaining full consistency in business logic and resilience against race conditions.

## Trade-offs

### 1. Simple ApiKeyGuard instead of OAuth2 / JWT
* **Why:** Securing all endpoints with a static API key from the header (`x-api-key`) is sufficient for demonstrating machine-to-machine communication authorization.
* **What’s in production:** Integration with an identity provider (e.g., Auth0, Keycloak) and verification of JWT tokens (Bearer Tokens) containing scopes/roles per client.

### 2. Static FX Rate Mock
* **Why:** To avoid external network dependencies (e.g., fixer.io/openexchangerates) and rate limit issues during testing.
* **What’s in production:** A separate service or a built-in cache (Redis) updated in real time from external sources (e.g., NBP/ECB exchange rate services) with a persisted history of exchange rates.

### 3. Type safety
In many places type safety could be improved before production, but for the sake of time, some type checks were omitted. For example, the `Currency` type could be an enum instead of a string.

## 4. Decimal/Money library
* **Why:** For simplicity, I used values from db and minimised risk of floating point errors.
* **What’s in production:** A proper decimal/money library (e.g., `currency.js`, `decimal.js` or `dinero.js`) should be used to avoid floating point errors and ensure accurate financial calculations.

## 5. Testing

Having more time, I would have  add unit tests and integration tests, especially for the Kafka event handling and the reconciliation logic.

## 6. Test data
There shouldn't be any seeding of test data on production.

## Assumptions

I'm not 100% sure what possible events could flow from the kafka, but I assumed 4 possible main events:

1. InvoiceReserved - possible also via REST api.
2. InvoiceReleased - possible also via REST api.
3. CapacityUpdated - of a specific program.
4. BulkReconciliation - full program state reconciliation, which can include capacity changing and invoices reservations.

It can be easily extended to support more events/handle it differently.
