import { ynabClientFactory } from 'util/helpers';
import { basicCatch } from 'util/catchers';
import { Orchestrator } from 'midtown';
import apiGatewayMiddleware from 'middleware/apiGateway';
import sessionMiddleware from 'middleware/sessionToken';
import parameterMiddleware, { Result as ParametersResult } from 'middleware/parameters';
import respond, { ApiResponse } from 'middleware/respond';

async function main(input: ParametersResult): Promise<ApiResponse> {
  const { sessionToken } = input;

  const { ynab, accessToken } = await ynabClientFactory(sessionToken);

  const budgets = await ynab.getBudgets(accessToken);

  return { body: budgets };
}

export const handler = new Orchestrator()
  .use(apiGatewayMiddleware)
  .use(sessionMiddleware)
  .use(parameterMiddleware)
  .use(main)
  .use(respond)
  .catch(basicCatch)
  .apiGatewayHandler();
