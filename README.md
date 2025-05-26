## Backend Configurations

# EF configuration

To update the database according EF, just run `dotnet ef database update --project Ambev.DeveloperEvaluation.ORM --startup-project Ambev.DeveloperEvaluation.WebApi`

# Ways to compile.

You have 2 ways to compile the backend webApi, just run the `Ambev.DeveloperEvaluation.WebApi` as startup project OR with docker compose (configuring the postgres by defaultConfiguration setting and compose properties)

---

# Kafka Local (Zookeeper + Kafka) with docker

This project use kafka to publish eventos as `SaleCreated`, `SaleModified`, `SaleCancelled` e `ItemCancelled`. To facilitate the local development, you can push kafka with docker without use docker compose

# 🚀 how to push Zookeeper and Kafka localmente (without docker compose)

Execute os comandos abaixo no terminal (PowerShell ou cmd):

```bash
docker run -d --name zookeeper -p 2181:2181 -e ZOOKEEPER_CLIENT_PORT=2181 confluentinc/cp-zookeeper:7.2.1 && docker run -d --name kafka -p 9092:9092 -e KAFKA_BROKER_ID=1 -e KAFKA_ZOOKEEPER_CONNECT=host.docker.internal:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 confluentinc/cp-kafka:7.2.1

---