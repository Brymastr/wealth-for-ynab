FROM ghcr.io/brymastr/lambda-ric-node:latest as base


FROM base as build
ARG FUNCTION_NAME
ARG FUNCTION_SCOPE
COPY package*.json ./
RUN npm ci --silent
COPY . ./
RUN npm run build $FUNCTION_NAME $FUNCTION_SCOPE


FROM base as release
COPY --from=build /home/node/app/tsconfig.json .
COPY --from=build /home/node/app/dist/ .
ENV NODE_OPTIONS=--enable-source-maps
CMD ["app.handler"]
