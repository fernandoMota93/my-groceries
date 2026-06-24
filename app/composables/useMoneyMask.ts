import { Money3Directive } from "v-money3";

export type MaskKind = "currency" | "quantity";

const baseConfig = {
  thousands: ".",
  decimal: ",",
  disableNegative: true,
  allowBlank: false,
  shouldRound: true,
};

export function useMoneyMaskConfig(kind: MaskKind) {
  if (kind === "currency") {
    return {
      ...baseConfig,
      prefix: "R$ ",
      precision: 2,
      masked: false,
    };
  }

  // quantity: sem prefixo, casas decimais menores
  // (equivalente ao antigo step="0.1" do estoque)
  return {
    ...baseConfig,
    prefix: "",
    precision: 1,
  };
}

export { Money3Directive };
