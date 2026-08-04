# Test the solution

Everything should be testable when the nest.js application is running.

## How to test this

### Endpoints

Best way to test the endpoints is to use Swagger documentation. You can access it at [http://localhost:3000/api](http://localhost:3000/api).

1. First press the "Authorize" button and enter the `API_KEY` from the [.env](./.env) file.

2. Then you can click on the endpoint you want to test, fill in the required parameters, and click "Execute".

Default `programId` in the database is `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11`

### Events from Kafka

1. I've created simple bash script to produce events to Kafka. You can run the following command and then select what example event publish:

```bash
./scripts/send-test-events.sh
```

2. Optionally you can go to the Kafka console at [http://localhost:8080](http://localhost:8080) and produce events manually.

#### Example events

- Topic: `treasury.capacity.updated`

  ```json
  {
      "programId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "totalCapacity": 50000,
      "currency": "EUR"
  }
  ```

- Topic: `treasury.invoice.reserved`

  ```json
  {
      "programId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "invoiceId": "INV-TEST-1785878839",
      "amount": 50000,
      "currency": "EUR"
  }
  ```

- Topic: `treasury.invoice.released`

  ```json
  {
      "invoiceId": "INV-TEST-1785878839",
  }
  ```

- Topic: `treasury.reconciliation.requested`

  ```json
  {
      "programId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "totalCapacity": 10000000,
      "activeInvoices": [
          {
              "invoiceId": "INV-REC-001",
              "amount": 100000,
              "currency": "USD"
          },
          {
              "invoiceId": "INV-REC-002",
              "amount": 50000,
              "currency": "EUR"
          }
      ]
  }
  ```
