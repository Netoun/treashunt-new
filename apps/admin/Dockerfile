# base node image
FROM oven/bun:1.1.6 as base
WORKDIR /usr/src/app

# INSTALL DEPENDENCIES
FROM base AS install
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

ARG NODE_VERSION=20
RUN apt update \
    && apt install -y curl
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n $NODE_VERSION \
    && rm n \
    && npm install -g n

RUN mkdir -p /temp/dev

COPY configs /temp/dev/configs
COPY packages/ /temp/dev/packages
COPY apps/admin/package.json /temp/dev/apps/admin/package.json
COPY package.json bun.lockb turbo.json /temp/dev/

RUN cd /temp/dev && bun install

RUN mkdir -p /temp/prod

COPY configs /temp/prod/configs
COPY packages /temp/prod/packages
COPY apps/admin/package.json /temp/prod/apps/admin/package.json
COPY package.json bun.lockb turbo.json /temp/prod/

RUN bun install turbo --global

RUN cd /temp/prod && bun install --production

# PREPARE RELEASE
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build

# RELEASE
FROM base AS release

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/apps/admin/build build
COPY --from=prerelease /usr/src/app/apps/admin/package.json .

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "start" ]