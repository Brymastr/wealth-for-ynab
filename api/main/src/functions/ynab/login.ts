import YNAB from 'util/Ynab';
import Parameters from 'util/ParameterStoreCache';
import { basicCatch } from 'util/catchers';
import { ClientConfig } from 'util/OAuth2Client';
import { Orchestrator } from 'midtown';
import apiGatewayMiddleware, { Result as ApiGatewayParsedResult } from 'middleware/apiGateway';
import redirect, { Redirect } from 'middleware/redirect';

const parameterKeys = ['ClientId', 'ClientSecret'];
const parameters = new Parameters(parameterKeys, 'YNAB', 5000);

async function main({ headers }: ApiGatewayParsedResult): Promise<Redirect> {
  const { Host, Referer: referer } = headers;

  const host = `https://${Host}/Prod`;

  const [clientId, clientSecret] = await parameters.get(parameterKeys);

  const config: ClientConfig = {
    clientId,
    clientSecret,
    authRedirectUri: `${host}/auth/ynab/token`,
  };

  const ynab = new YNAB(config);

  const location = ynab.buildAuthorizeUrl(referer);

  return { location };
}

export const handler = new Orchestrator()
  .use(apiGatewayMiddleware)
  .use(main)
  .use(redirect)
  .catch(basicCatch)
  .apiGatewayHandler();
