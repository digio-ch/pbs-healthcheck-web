FROM node:16.17 AS dependencies
WORKDIR /srv
COPY package.json ./
COPY yarn.lock ./
RUN yarn

FROM node:16.17 AS build
ARG configuration=dev
WORKDIR /srv
COPY ./ ./
COPY --from=dependencies /srv/node_modules ./node_modules
RUN yarn build --configuration=${configuration} --aot

FROM abiosoft/caddy:1.0.3-no-stats
COPY --from=build /srv/dist/healthcheck-web ./healthcheck-web/
COPY docker/Caddyfile /etc/Caddyfile
