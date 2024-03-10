FROM oven/bun:canary-alpine as base
WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY /dist .

USER bun

ENTRYPOINT [ "bun", "run", "index.js" ]