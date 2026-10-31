/**
 * Sysotto Integration Contracts & DTOs
 *
 * Normative references:
 * - Sysotto.Docs/architecture/industry-sitebuilder-catalog-contract-v1.md
 * - Sysotto.Industry/docs/spec.md (IND-001, IND-005)
 *
 * Guardrail IND-005: X-Tenant-Id is strictly forbidden for public/anonymous endpoints.
 * Public resolution must rely exclusively on siteSlug or verified Host.
 */

export interface IndustryCatalogImageDto {
  assetId: string;
  url: string;
  width?: number;
  height?: number;
  altText?: string;
}

export interface IndustryCatalogProductDto {
  productId: string;
  name: string;
  description: string;
  unitOfMeasure: string;
  sourceUpdatedAtUtc?: string;
  images: IndustryCatalogImageDto[];
}

export interface IndustryCatalogSectionV1 {
  type: "IndustryCatalog_V1";
  id: string;
  isVisible: boolean;
  title?: string;
  introduction?: string;
  presentation?: "cards" | "list";
  products: IndustryCatalogProductDto[];
}

/**
 * Public lead capture payload for Sysotto.Communication / SiteBuilder
 */
export interface PublicLeadCaptureRequestDto {
  siteSlug: string;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  message?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface PublicLeadCaptureResponseDto {
  success: boolean;
  leadId?: string;
  message?: string;
}

/**
 * Order intent payload for Sysotto.Sales / Social Commerce
 */
export interface WhatsAppOrderItemIntentDto {
  productId?: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice?: number;
  subtotal?: number;
}

export interface WhatsAppOrderIntentDto {
  siteSlug: string;
  protocol: string;
  customerName?: string;
  deliveryMode?: "Entrega" | "Retirada" | string;
  location?: string;
  paymentMethod?: "Pix" | "Cartão" | "Dinheiro" | string;
  notes?: string;
  items: WhatsAppOrderItemIntentDto[];
  totalItems: number;
  estimatedTotal?: number;
  hasUnpricedItems: boolean;
  createdAtUtc?: string;
}

export interface WhatsAppOrderIntentResponseDto {
  success: boolean;
  intentId?: string;
  protocol?: string;
  message?: string;
}
