FROM node:14 as builder 

COPY . /app/httpc

WORKDIR /app/httpc

RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:14-alpine as production

WORKDIR /app/httpc

COPY --from=build /app/httpc/dist /app/httpc/dist

RUN yarn install --frozen-lockfile --production

ENTRYPOINT ["path to exec"]