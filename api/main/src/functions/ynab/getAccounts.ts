import { ynabClientFactory } from 'util/helpers';
import { basicCatch } from 'util/catchers';
import { Orchestrator } from 'midtown';
import apiGatewayMiddleware from 'middleware/apiGateway';
import sessionMiddleware from 'middleware/sessionToken';
import parameterMiddleware, { Result as ParametersResult } from 'middleware/parameters';
import respond, { ApiResponse } from 'middleware/respond';

async function main(input: ParametersResult): Promise<ApiResponse> {
  const { sessionToken, budgetId } = input;

  const { ynab, accessToken } = await ynabClientFactory(sessionToken);

  const accounts = await ynab.getAccounts(budgetId, accessToken);

  return { body: accounts };
}

export const handler = new Orchestrator()
  .use(apiGatewayMiddleware)
  .use(sessionMiddleware)
  .use(parameterMiddleware)
  .use(main)
  .use(respond)
  .catch(basicCatch)
  .apiGatewayHandler();
