export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR');
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('pt-BR');
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
