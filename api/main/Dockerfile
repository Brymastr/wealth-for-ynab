FROM ghcr.io/brymastr/lambda-ric-node:latest as base
COPY package*.json ./


FROM base as build
ARG FUNCTION_NAME
ARG FUNCTION_SCOPE
RUN npm ci --silent
COPY . ./
RUN npm run build $FUNCTION_NAME $FUNCTION_SCOPE


FROM base as release
ARG FUNCTION_SCOPE
ARG FUNCTION_NAME
COPY --from=build /home/node/app/tsconfig.json .
COPY --from=build /home/node/app/dist/ .
ENV NODE_OPTIONS=--enable-source-maps
CMD ["app.handler"]
