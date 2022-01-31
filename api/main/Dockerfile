FROM public.ecr.aws/k6u4r4g3/lambda-ric-node:latest as base
COPY package*.json ./


FROM base as prod_mods
RUN npm ci --production --silent


FROM base as build
ARG FUNCTION_NAME
ARG FUNCTION_SCOPE
RUN npm ci --silent
COPY . ./
RUN npm run build -- $FUNCTION_NAME $FUNCTION_SCOPE


FROM base as release
ARG FUNCTION_SCOPE
ENV func $FUNCTION_SCOPE
COPY --from=prod_mods /home/node/app/node_modules ./node_modules
COPY --from=build /home/node/app/tsconfig.json .
COPY --from=build /home/node/app/dist/ .
WORKDIR /home/node/app/functions/$FUNCTION_SCOPE
ENTRYPOINT ["/usr/local/bin/npx", "/home/node/aws-lambda-ric/bin/index.js"]
CMD "$func.handler"
