import '../../util/registration';

import { createPeriodicNetWorth, ynabClientFactory } from 'util/helpers';
import { basicCatch } from 'util/catchers';
import Middleware from 'middleware/Middleware';
import apiGatewayMiddleware from 'middleware/apiGateway';
import sessionMiddleware from 'middleware/sessionToken';
import parameterMiddleware, { Result as ParametersResult } from 'middleware/parameters';
import respond, { ApiResponse } from 'middleware/respond';

async function main(input: ParametersResult): Promise<ApiResponse> {
  const { sessionToken, budgetId, includePrevious, granularity } = input;

  const { ynab, accessToken } = await ynabClientFactory(sessionToken);

  const transactions = await ynab.getTransactions(budgetId, accessToken);

  const periodicNetworth = createPeriodicNetWorth(transactions, granularity, includePrevious);

  return { body: periodicNetworth };
}

export const handler = new Middleware()
  .pipe(apiGatewayMiddleware)
  .pipe(sessionMiddleware)
  .pipe(parameterMiddleware)
  .pipe(main)
  .pipe(respond)
  .catch(basicCatch)
  .handler();
