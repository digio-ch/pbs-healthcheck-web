FROM node:24-alpine3.23 AS dependencies
WORKDIR /srv
COPY package.json ./
COPY yarn.lock ./
RUN yarn

FROM node:24-alpine3.23 AS build
ARG configuration=dev
WORKDIR /srv
COPY ./ ./
COPY --from=dependencies /srv/node_modules ./node_modules
RUN yarn build --configuration=${configuration} --aot

FROM caddy:2.11.4-alpine
COPY --from=build /srv/dist/healthcheck-web/browser /srv/healthcheck-web/
COPY docker/Caddyfile /etc/caddy/Caddyfile
