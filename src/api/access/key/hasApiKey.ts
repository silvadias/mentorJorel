/**
 * @file hasValidApiKey.ts
 * @description Comandos de domínio responsáveis por verificar a validade e extrair metadados de chaves Multi-Tenant.
 */

import type { ApiKeySessionPayload } from '../../../infrastructure/security/engine/apiKeySession';
import      { memoryConnection }     from '../../../database/Memory/memoryConnection';
import      { DomainException }      from '../../errors/domainException';

/**
 * Padrão Limpo: Verifica estritamente se a requisição possui uma chave ativa no sistema.
 * Retorna true se a chave for válida e não suspensa, ou false para qualquer outro cenário.
 */
export function hasValidApiKey(apiKey: string): boolean {
  const databaseRow = memoryConnection.query.findKeyByString(apiKey);

  if (!databaseRow || databaseRow.is_suspended === 1) {
    return false;
  }

  return true;
}

/**
 * Padrão Limpo: Extrai e traduz os metadados ricos da aplicação parceira para o tráfego de rede.
 * Lança exceção de domínio se for invocada para uma chave explicitamente inexistente.
 */
export function getApiKeySession(apiKey: string): ApiKeySessionPayload {
  const databaseRow = memoryConnection.query.findKeyByString(apiKey);

  if (!databaseRow) {
    throw new DomainException('SECURITY_TOKEN_CORRUPTED');
  }

  return {
    applicationId   : databaseRow.app_id,
    developerId     : databaseRow.developer_id,
    rateLimitTier   : databaseRow.plan_tier,
    isSuspended     : databaseRow.is_suspended === 1
  };
}
