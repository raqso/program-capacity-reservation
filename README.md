<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

Solution for the "Program Capacity & Invoice Reservation" recruitment challenge. The solution is implemented using NestJS framework, Kafka and PostgreSQL as the database.

## Prerequisites

- Node.js v18 or higher
- Docker and Docker Compose

## Project setup

```bash
npm install &&
cp .env.sample .env &&
docker compose up -d &&
npm run migration:run
```

## Start the application


```bash
npm run start
```

### Access the application

Swagger documentation: [http://localhost:3000/api](http://localhost:3000/api)

API endpoint: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)

Kafka console: [http://localhost:8080](http://localhost:8080)

## How to test this:

### Endpoints

Best way to test the endpoints is to use Swagger documentation. You can access it at [http://localhost:3000/api](http://localhost:3000/api). 

First press the "Authorize" button and enter the `API_KEY` from the [.env](./.env) file. 
Then you can click on the endpoint you want to test, fill in the required parameters, and click "Execute".

Initial programId from seeds is `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11`

### Events from Kafka

1. I've created simple bash script to produce events to Kafka. You can run the following command and then select what example event publish:

```bash
./scripts/send-test-events.sh
```

2. Optionally You can go to the Kafka console at [http://localhost:8080](http://localhost:8080) and produce events manually. For example, you can produce an event to the `treasury.invoice.reserved` topic with the following payload:

```json
{
    "programId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "invoiceId": "INV-TEST-1785878839",
    "amount": 50000,
    "currency": "EUR"
}
```
