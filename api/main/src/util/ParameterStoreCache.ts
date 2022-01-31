import { SSMClient, GetParametersCommand } from '@aws-sdk/client-ssm';

export default class ParameterStoreCache {
  private cache: Map<string, string>;
  private expires = 0;
  private prefix: string = '/';
  private ssm = new SSMClient({});

  constructor(private names: string[], prefix?: string, private timeoutSeconds = 300) {
    this.cache = new Map<string, string>();
    if (prefix) this.prefix = this.strip(`/${prefix}/`);
  }

  public async load() {
    this.cache.clear();

    const batchedNames = this.batchParameterKeys(
      this.names.map(name => this.strip(`/${this.prefix}/${name}`)),
    );

    const promises = batchedNames.map(batch => {
      const command = new GetParametersCommand({
        Names: batch,
        WithDecryption: true,
      });
      return this.ssm.send(command);
    });

    const result = await Promise.all(promises);
    const parameters = result.flatMap(x => x.Parameters);

    for (const parameter of parameters) {
      const name = parameter.Name.replace(this.prefix, '');
      this.cache.set(name, parameter.Value);
    }

    this.expires = Date.now() + this.timeoutSeconds * 1000;
  }

  private batchParameterKeys(names: string[]) {
    const batches: string[][] = [];
    for (let i = 0; i < names.length; i += 10) {
      const slice = names.slice(i, i + 10);
      batches.push(slice);
    }

    return batches;
  }

  public async get(key: string): Promise<string | undefined>;
  public async get(keys: string[]): Promise<Array<string | undefined>>;
  public async get(keys: string | string[]): Promise<string | Array<string | undefined> | undefined> {
    if (this.expires < Date.now()) await this.load();

    const queryKeys = [];

    if (keys instanceof Array) queryKeys.push(...keys);
    else queryKeys.push(keys);

    const result = queryKeys.map(key => {
      return this.cache.get(key);
    });

    if (keys instanceof Array) return result;
    else return result[0];
  }

  private strip(str: string) {
    return str.replace(/[\/]{2,}/g, '/');
  }
}
