export interface HttpTrafficRequest<
  Payload = any, 
  QueryParameters = any, 
  RouteParameters = any, 
  HeaderProperties = any
> {
    body: Payload;
    query: QueryParameters;
    params: RouteParameters;
    headers: HeaderProperties;

  }

export interface HttpTrafficResponse<Payload = any> {
  statusCode: number;
  body: Payload;

}

export type HttpTrafficHandler = (request: HttpTrafficRequest) => Promise<HttpTrafficResponse>;

export interface HttpTrafficExchangeEngine {
  register(method: 'get' | 'post' | 'put' | 'delete', resourcePath: string, handler: HttpTrafficHandler): void;
  start(): void;
  
}