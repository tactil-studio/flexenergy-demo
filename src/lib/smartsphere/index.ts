/**
 * SmartSphere API Client — public interface
 *
 * Usage:
 *   import { getClient, setAuthToken, clearAuthToken, SOURCE_ID } from '@/lib/smartsphere';
 *
 * After login:
 *   setAuthToken(tokenResponse.access_token);
 *
 * All subsequent getClient() calls return a client with the token set.
 */
export { SmartSphereApiClient, getClient, setAuthToken, clearAuthToken, SOURCE_ID } from "./client";

// Core types
export type { SmartSphereClientConfig, DateInput, SumMethod, TransactionSource, TransactionStatus } from "./core";
export { SmartSphereApiError } from "./core";

// Feature module types (re-export what the services layer needs)
export type { TokenResponse, RestRequestToken } from "./modules/auth";
export type { ResetPasswordRequest } from "./modules/account";
export type { ApiCustomerDashboard, SimpleRequest, CustomerDashboardData, ContractServiceReducedDto } from "./modules/contract";
export type {
  ApiTransaction,
  ListTransactionsRequest,
  ListTransactionsResponse,
  SetTransactionRequest,
  GetCustomerBalanceResponse,
} from "./modules/financial";
export type { GraphicMulti, GetCostsAndMeasuresRequest } from "./modules/graphics";
export type { CompanyResponse } from "./modules/language";
