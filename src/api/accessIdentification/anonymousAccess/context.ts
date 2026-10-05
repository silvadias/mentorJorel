export interface AnonymousBrowserMetadata {
  readonly os: 'windows' | 'linux' | 'macos' | 'ios' | 'android' | 'unknown';
  readonly browser: string;
  readonly ipAddress: string;
  readonly countryCode: string;
  readonly userAgent: string;
  readonly preferredLanguages: string[];
  readonly isMobile: boolean;
}

export interface AnonymousDeviceContext {
  readonly fingerprintId: string;
  readonly browserInstanceId: string;
  readonly permanentDeviceId?: string;
  readonly firstSeenAt: Date;
  readonly lastActivityAt: Date;
  readonly metadata: AnonymousBrowserMetadata;
}