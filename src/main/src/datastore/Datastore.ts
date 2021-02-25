import { DynamoDB, GetItemInput, PutItemInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const TABLE_NAME = 'Users';

export interface QueryPrimaryKeys {
  HashKey: string;
  RangeKey?: string;
}

export default class Datastore {
  protected client = new DynamoDB({});

  protected async getItem(query: Record<string, any>) {
    const params: GetItemInput = {
      TableName: TABLE_NAME,
      Key: marshall(query),
    };

    const { Item } = await this.client.getItem(params);
    const result = unmarshall(Item);

    return result;
  }

  protected async setItem(query: Record<string, any>) {
    const params: PutItemInput = {
      TableName: TABLE_NAME,
      Item: marshall(query),
    };

    const result = await this.client.putItem(params);

    return unmarshall(result.Attributes);
  }
}
