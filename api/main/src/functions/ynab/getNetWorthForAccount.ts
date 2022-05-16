import { createPeriodicNetWorth, ynabClientFactory } from 'util/helpers';
import { basicCatch } from 'util/catchers';
import { Orchestrator } from 'midtown';
import apiGatewayMiddleware from 'middleware/apiGateway';
import sessionMiddleware from 'middleware/sessionToken';
import parameterMiddleware, { Result as ParametersResult } from 'middleware/parameters';
import respond, { ApiResponse } from 'middleware/respond';

async function main(input: ParametersResult): Promise<ApiResponse> {
  const { sessionToken, budgetId, accountId, includePrevious, granularity } = input;

  const { ynab, accessToken } = await ynabClientFactory(sessionToken);

  const transactions = await ynab.getTransactionsByAccount(budgetId, accountId, accessToken);

  const periodicNetworth = createPeriodicNetWorth(transactions, granularity, includePrevious);

  return { body: periodicNetworth };
}

export const handler = new Orchestrator()
  .use(apiGatewayMiddleware)
  .use(sessionMiddleware)
  .use(parameterMiddleware)
  .use(main)
  .use(respond)
  .catch(basicCatch)
  .apiGatewayHandler();
