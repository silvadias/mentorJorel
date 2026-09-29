ENTREGAS DE CICLOS: CONTRATOS DEFINIDOS (CONSOLIDADO)
### `src/api/accessIdentification/contracts/deviceContext.ts`
Contrato abstrato, imutável (`readonly`) e alinhado a padrões de alta segurança de mercado (Auth0/Clerk). Captura metadados técnicos do navegador e isola sessões de múltiplos usuários no mesmo hardware através de `browserInstanceId`:
*   `AccessDeviceBrowserMetadata`: `os`, `browser`, `ipAddress`, `countryCode`, `userAgent`, `preferredLanguages`, `isMobile`.
*   `AccessDeviceContext`: `fingerprintId` (fixo da máquina), `browserInstanceId` (efêmero do navegador), `permanentDeviceId` (opcional para apps/passkeys), `firstSeenAt`, `lastActivityAt`, `metadata`.
