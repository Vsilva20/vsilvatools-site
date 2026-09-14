export type ProductCategory = 'Inserto' | 'Fresa' | 'Broca T-Max';

export interface ProductMeasure {
  codigo: string;
  preco: number;
}

export interface Product {
  id: number;
  slug: string;
  nome: string;
  categoria: ProductCategory;
  subcategoria: string;
  marcas: string[];
  descricaoCurta: string;
  descricaoDetalhada: string;
  imagens: string[];
  medidas: ProductMeasure[];
  destaque: boolean;
  ativo: boolean;
}

export interface ContactFormData {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  recaptchaToken: string;
}
