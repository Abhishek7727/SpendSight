export const formatPrice = (value: number, currency: string = "INR"): string => {
  const safeCurrency = (currency || "INR").trim();
  const locale = safeCurrency === "INR" ? "en-IN" : undefined;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${safeCurrency} ${Math.round(value).toLocaleString()}`;
  }
};
