import      { AnonymousDeviceRequestParser,
            type RawInput }             from './requestParser';
import type { AnonymousDeviceContext }  from './context';

export class AnonymousAccessDelivery {
  public handleFromHeaders(
    headers: Record<string, string | string[] | undefined>, 
    remoteAddress?: string
  ): AnonymousDeviceContext {
      const input: RawInput = {
        fingerprintId: headers['x-fingerprint-id'] as string,
        browserInstanceId: headers['x-browser-instance-id'] as string,
        permanentDeviceId: headers['x-permanent-device-id'] as string,
        userAgent: headers['user-agent'] as string,
        ipAddress: (headers['x-forwarded-for'] as string) || remoteAddress,
        countryCode: headers['cf-ipcountry'] as string,
        acceptLanguage: headers['accept-language'] as string,
    };
    return AnonymousDeviceRequestParser.parse(input);

  }
}