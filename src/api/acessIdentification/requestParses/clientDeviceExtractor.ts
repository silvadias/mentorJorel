import { ApiError }                         from '../../errors/apiError';
import type { AccessDeviceContext,
              AccessDeviceBrowserMetadata } from '../contracts/deviceContext';

export interface RawDeviceInput {
  readonly fingerprintId?: string;
  readonly browserInstanceId?: string;
  readonly permanentDeviceId?: string;
  readonly userAgent?: string;
  readonly ipAddress?: string;
  readonly countryCode?: string;
  readonly acceptLanguage?: string;
}

export class ClientDeviceExtractor {

  public static extract(input: RawDeviceInput): AccessDeviceContext {
    if (!input.fingerprintId || !input.browserInstanceId) {
      throw new ApiError('MISSING_DEVICE_IDENTIFIERS' as any);
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

  private static extractMetadata(input: RawDeviceInput): AccessDeviceBrowserMetadata {
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

  private static parseOperatingSystem(userAgent: string): AccessDeviceBrowserMetadata['os'] {
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
