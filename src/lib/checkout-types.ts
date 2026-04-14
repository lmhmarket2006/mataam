export type CheckoutDisplayPayload = {
  subtotalSar: number;
  deliveryFeeSar: number;
  totalSar: number;
  lines: Array<{ nameSnapshot: string; quantity: number; lineTotalSar: number; optionLabels: string[] }>;
};
