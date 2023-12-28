FROM node:18.17.0-alpine as base

FROM base as deps

WORKDIR /app

COPY package.json package-lock.json .babelrc.js ./

RUN npm ci --production

FROM base as builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY --from=deps /app/package.json /app/package-lock.json /app/.babelrc.js ./

COPY src ./src

RUN npm run build

FROM base as release

WORKDIR /app

COPY --from=builder /app/build ./build

COPY --from=deps /app/node_modules ./node_modules

COPY --from=builder /app/package.json /app/package-lock.json ./

EXPOSE 4000

CMD ["npm", "run", "start"]