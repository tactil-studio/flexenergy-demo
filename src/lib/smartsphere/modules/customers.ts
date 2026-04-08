import type { HttpCore } from "../core";

// ─── DTOs ──────────────────────────────────────────────────────────────────────
export interface SetCustomerRequestDto {
  buCustomerID?: string | null;
  lastName?: string | null;
  firstName?: string | null;
  companyName?: string | null;
  address1?: string | null;
  postalCode?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  poBox?: string | null;
  address2?: string | null;
  country?: string | null;
}

export interface SetCustomerResponseDto {
  status: boolean;
  message?: string | null;
  customeID: number;
  buCustomerID?: string | null;
}

// ─── Module ────────────────────────────────────────────────────────────────────
export class CustomersModule {
  constructor(private readonly http: HttpCore) {}

  createCustomer(body: SetCustomerRequestDto) {
    return this.http.post<SetCustomerResponseDto>("/Api/v1/Customers/CreateCustomer", body);
  }
}
