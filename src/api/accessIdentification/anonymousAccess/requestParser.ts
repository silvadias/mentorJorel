import { DomainException }                from '../../../infrastructure/httpTraffic/engine/errors';
import type { AnonymousDeviceContext,
              AnonymousBrowserMetadata }  from './context';

export interface RawInput {
  readonly fingerprintId?: string | undefined;
  readonly browserInstanceId?: string | undefined;
  readonly permanentDeviceId?: string | undefined;
  readonly userAgent?: string | undefined;
  readonly ipAddress?: string | undefined;
  readonly countryCode?: string | undefined;
  readonly acceptLanguage?: string | undefined;

}

export class AnonymousDeviceRequestParser {
  public static parse(input: RawInput): AnonymousDeviceContext {
    if (!input.fingerprintId || !input.browserInstanceId) {
      throw new DomainException('MISSING_DEVICE_IDENTIFIERS');

    }

    const currentTimestamp = new Date();
    const metadata = this.extractMetadata(input);

    return {
      fingerprintId: input.fingerprintId,
      browserInstanceId: input.browserInstanceId,
      ...(input.permanentDeviceId && { permanentDeviceId: input.permanentDeviceId }),
      firstSeenAt: currentTimestamp,
      lastActivityAt: currentTimestamp,
      metadata,

    };
  }

  private static extractMetadata(input: RawInput): AnonymousBrowserMetadata {
    const userAgent = input.userAgent || 'unknown';

    return {
      os: this.parseOperatingSystem(userAgent),
      browser: this.parseBrowser(userAgent),
      ipAddress: this.sanitizeIpAddress(input.ipAddress),
      countryCode: input.countryCode || 'unknown',
      userAgent,
      preferredLanguages: this.parsePreferredLanguages(input.acceptLanguage),
      isMobile: this.checkIfMobileDevice(userAgent),

    };
  }

  private static sanitizeIpAddress(rawIpAddress?: string): string {
    if (!rawIpAddress) return '127.0.0.1';
    const clientIpList = rawIpAddress.split(',');
    const firstIp = clientIpList.shift() ?? '127.0.0.1';
    return firstIp.trim();

  }

  private static parsePreferredLanguages(acceptLanguageHeader?: string): string[] {
    if (!acceptLanguageHeader) return ['en'];

    return acceptLanguageHeader.split(',').map(language => {
      const segments = language.split(';');
      const primaryLanguageCode = segments.shift() ?? '';
      return primaryLanguageCode.trim();
    }).filter(Boolean);

  }

  private static checkIfMobileDevice(userAgent: string): boolean {
    return /mobile|android|iphone|ipad|phone/i.test(userAgent);

  }

  private static parseOperatingSystem(userAgent: string): AnonymousBrowserMetadata['os'] {
    const lowerCaseUserAgent = userAgent.toLowerCase();
    if (lowerCaseUserAgent.includes('win')) return 'windows';
    if (lowerCaseUserAgent.includes('macintosh') || lowerCaseUserAgent.includes('mac os')) return 'macos';
    if (lowerCaseUserAgent.includes('android')) return 'android';
    if (lowerCaseUserAgent.includes('iphone') || lowerCaseUserAgent.includes('ipad')) return 'ios';
    if (lowerCaseUserAgent.includes('linux')) return 'linux';
    return 'unknown';

  }

  private static parseBrowser(userAgent: string): string {
    const lowerCaseUserAgent = userAgent.toLowerCase();
    if (lowerCaseUserAgent.includes('edg/')) return 'Edge';
    if (lowerCaseUserAgent.includes('chrome/') && !lowerCaseUserAgent.includes('chromium/')) return 'Chrome';
    if (lowerCaseUserAgent.includes('safari/') && !lowerCaseUserAgent.includes('chrome/')) return 'Safari';
    if (lowerCaseUserAgent.includes('firefox/')) return 'Firefox';
    return 'Unknown Browser';
  }

}