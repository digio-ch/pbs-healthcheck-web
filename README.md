# pbs-healthcheck-web

`pbs-healthcheck-web` is the front-end of the HealthCheck Application.
It contains an Angular application which fetches data from the back-end (pbs-healthcheck-core) and visualizes it.

## Getting Started

This guide should help you get the project up and running locally on any machine.

### Prerequisites

1. Read the application docs to get an understanding of how things work, you can find them in the `pbs-healthcheck-core`
   repo inside `doc/index.md`.
2. Make sure your docker installation is up to date so that it supports docker-compose version 3.7 syntax.
3. You will need to request access to the MiData testing/integration environment in order to run the data import
   procedure and authenticate with OAuth 2.0.
4. Make sure port 4200 is available on your machine.

### Docker Setup

The whole HealthCheck application is dockerized, so it can be run independent of the host platform.
Additionally, you do not need to install anything (node, ...) everything will run inside the containers.
It is highly recommended that you run this application with docker and docker-compose we will not provide any additional
guides for running the application without docker or with local node/npm installations.

### Start Services

```shell
docker-compose -f docker/docker-compose.yml up -d
```

### Install Dependencies & Serve App

```shell
docker exec healthcheck-web-local yarn install
docker exec healthcheck-web-local yarn run start --host 0.0.0.0
```
