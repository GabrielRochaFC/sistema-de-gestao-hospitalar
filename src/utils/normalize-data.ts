export const normalizeCPF = (cpf: string): string => {
  return cpf.replace(/[^\d]/g, "");
};

export const normalizePhone = (phone: string): string => {
  return phone.replace(/[^\d]/g, "");
};
