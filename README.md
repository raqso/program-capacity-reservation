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

## How to test this

[See TESTING.md](./docs/TESTING.MD)
