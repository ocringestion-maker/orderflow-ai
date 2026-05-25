export type OrderStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED";
export type MessageType = "text" | "audio" | "image";

export interface Order {
  id: number;
  retailer_id: number;
  source_message_id: number;
  order_status: OrderStatus;
  overall_confidence: number;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_name: string;
  extracted_quantity: string;
  extracted_unit: string;
  ai_confidence: number;
  created_at: string;
}

export interface Retailer {
  id: number;
  retailer_name: string;
  phone_number: string;
}

export interface IncomingMessage {
  id: number;
  message_type: MessageType;
  raw_message?: string | null;
  transcribed_text?: string | null;
  media_path?: string | null;
  raw_ai_response?: string | null;
  ai_confidence?: number | null;
  created_at?: string;
}

export interface OrderDetailsResponse {
  order: Order;
  items: OrderItem[];
  retailer?: Retailer;
  message?: IncomingMessage;
}
