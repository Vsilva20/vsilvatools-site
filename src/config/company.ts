export interface CompanyConfig {
  name: string;
  baseUrl: string;
  whatsapp: string;
  phoneDisplay: string;
  email: string;
  instagram: string;
  tiktok: string;
}

export const COMPANY: Readonly<CompanyConfig> = {
  name: 'Vsilva Tools',
  baseUrl: 'https://vsilvatools.com.br',
  whatsapp: '5511947502963',
  phoneDisplay: '(11) 94750-2963',
  email: 'vsilvatools@gmail.com',
  instagram: 'https://www.instagram.com/vsilvatools',
  tiktok: 'https://www.tiktok.com/@vsilvatools',
};

export function createWhatsAppUrl(message: string): string {
  return `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(message)}`;
}
