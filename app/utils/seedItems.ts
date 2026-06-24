import { db } from '~/services/firebase';
import {
  collection,
  getDocs,
  writeBatch,
  doc,
} from 'firebase/firestore';

const items = [
  // Alimentos
  { name: 'Refrigerante zero lt', category: 'Alimentos', amount: 48, active: true, order: 1 },
  { name: 'Arroz', category: 'Alimentos', amount: 2, active: true, order: 2 },
  { name: 'Feijão preto', category: 'Alimentos', amount: 1, active: true, order: 3 },
  { name: 'Feijão carioca', category: 'Alimentos', amount: 1, active: true, order: 4 },
  { name: 'Açucar', category: 'Alimentos', amount: 1, active: true, order: 5 },
  { name: 'Farinha de trigo', category: 'Alimentos', amount: 3, active: true, order: 6 },
  { name: 'Fermento biológico', category: 'Alimentos', amount: 6, active: true, order: 7 },
  { name: 'Macarrão parafuso', category: 'Alimentos', amount: 4, active: true, order: 8 },
  { name: 'Macarrao para Yakisoba', category: 'Alimentos', amount: 1, active: true, order: 9 },
  { name: 'Queijo ralado', category: 'Alimentos', amount: 4, active: true, order: 10 },
  { name: 'Cuscuz', category: 'Alimentos', amount: 1, active: true, order: 11 },
  { name: 'Milho', category: 'Alimentos', amount: 4, active: true, order: 12 },
  { name: 'Extrato de tomate', category: 'Alimentos', amount: 2, active: true, order: 13 },
  { name: 'Milho de pipoca', category: 'Alimentos', amount: 1, active: true, order: 14 },
  { name: 'Farinha', category: 'Alimentos', amount: 1, active: true, order: 15 },
  { name: 'Creme de leite', category: 'Alimentos', amount: 6, active: true, order: 16 },
  { name: 'Leite condensado', category: 'Alimentos', amount: 2, active: true, order: 17 },
  { name: 'Cacau em po', category: 'Alimentos', amount: 1, active: true, order: 18 },
  { name: 'Goiabada', category: 'Alimentos', amount: 1, active: true, order: 19 },
  { name: 'Café', category: 'Alimentos', amount: 1, active: true, order: 20 },
  { name: 'Filtro café 102', category: 'Alimentos', amount: 1, active: true, order: 21 },
  { name: 'Café máquina', category: 'Alimentos', amount: 1, active: true, order: 22 },
  { name: 'Aveia', category: 'Alimentos', amount: 3, active: true, order: 23 },
  { name: 'Margarina com sal', category: 'Alimentos', amount: 1, active: true, order: 24 },

  // Pets
  { name: 'Patê gatos', category: 'Pets', amount: 4, active: true, order: 25 },
  { name: 'Patê cachorro', category: 'Pets', amount: 4, active: true, order: 26 },
  { name: 'Ração darwin', category: 'Pets', amount: 1, active: true, order: 27 },
  { name: 'Ração gatos', category: 'Pets', amount: 1, active: true, order: 28 },
  { name: 'Petisco', category: 'Pets', amount: 2, active: true, order: 29 },

  // Condimentos
  { name: 'Shoyu', category: 'Condimentos', amount: 1, active: true, order: 30 },
  { name: 'Mostarda', category: 'Condimentos', amount: 1, active: true, order: 31 },
  { name: 'Ketchup', category: 'Condimentos', amount: 1, active: true, order: 32 },
  { name: 'Vinagre', category: 'Condimentos', amount: 1, active: true, order: 33 },
  { name: 'Oleo', category: 'Condimentos', amount: 1, active: true, order: 34 },
  { name: 'Sal', category: 'Condimentos', amount: 1, active: true, order: 35 },
  { name: 'Alho', category: 'Condimentos', amount: 1, active: true, order: 36 },

  // Temperos
  { name: 'Lemom pepper', category: 'Temperos', amount: 1, active: true, order: 37 },
  { name: 'Chimichurri', category: 'Temperos', amount: 2, active: true, order: 38 },
  { name: 'Paprica defumada', category: 'Temperos', amount: 1, active: true, order: 39 },
  { name: 'Noz moscada', category: 'Temperos', amount: 1, active: true, order: 40 },
  { name: 'Alho, salsa e cebola', category: 'Temperos', amount: 1, active: true, order: 41 },
  { name: 'Fumaca em po', category: 'Temperos', amount: 1, active: true, order: 42 },
  { name: 'P. calabresa', category: 'Temperos', amount: 3, active: true, order: 43 },
  { name: 'Acafrao', category: 'Temperos', amount: 3, active: true, order: 44 },
  { name: 'Coloral', category: 'Temperos', amount: 3, active: true, order: 45 },
  { name: 'Cominho', category: 'Temperos', amount: 1, active: true, order: 46 },
  { name: 'Louro', category: 'Temperos', amount: 1, active: true, order: 47 },

  // Carnes e Frios
  { name: 'Brócolis 600gr', category: 'Carnes e Frios', amount: 1, active: true, order: 48 },
  { name: 'Queijo cheddar 400gr', category: 'Carnes e Frios', amount: 1, active: true, order: 49 },
  { name: 'Bacon', category: 'Carnes e Frios', amount: 1, active: true, order: 50 },
  { name: 'Batata congelada', category: 'Carnes e Frios', amount: 1, active: true, order: 51 },
  { name: 'Frango 8kg', category: 'Carnes e Frios', amount: 8, active: true, order: 52 },
  { name: 'Carne moída 6kg', category: 'Carnes e Frios', amount: 6, active: true, order: 53 },
  { name: 'Carne em tiras 600gr', category: 'Carnes e Frios', amount: 0.6, active: true, order: 54 },
  { name: 'Ovos', category: 'Carnes e Frios', amount: 1, active: true, order: 55 },

  // Limpeza
  { name: 'Detergente', category: 'Limpeza', amount: 2, active: true, order: 56 },
  { name: 'Sabão de coco', category: 'Limpeza', amount: 1, active: true, order: 57 },
  { name: 'Água sanitária', category: 'Limpeza', amount: 1, active: true, order: 58 },
  { name: 'Sabão líquido', category: 'Limpeza', amount: 2, active: true, order: 59 },
  { name: 'Amaciante', category: 'Limpeza', amount: 1, active: true, order: 60 },
  { name: 'Inseticida', category: 'Limpeza', amount: 2, active: true, order: 61 },
  { name: 'Citronela', category: 'Limpeza', amount: 1, active: true, order: 62 },
  { name: 'Bom ar', category: 'Limpeza', amount: 1, active: true, order: 63 },
  { name: 'Desinfetante', category: 'Limpeza', amount: 1, active: true, order: 64 },
  { name: 'Essência', category: 'Limpeza', amount: 1, active: true, order: 65 },
  { name: 'Limpa vidro', category: 'Limpeza', amount: 1, active: true, order: 66 },
  { name: 'Óleo de peroba', category: 'Limpeza', amount: 1, active: true, order: 67 },
  { name: 'Veja', category: 'Limpeza', amount: 1, active: true, order: 68 },
  { name: 'Álcool', category: 'Limpeza', amount: 1, active: true, order: 69 },
  { name: 'Toalha de papel', category: 'Limpeza', amount: 1, active: true, order: 70 },
  { name: 'Saco para frezer', category: 'Limpeza', amount: 1, active: true, order: 71 },
  { name: 'Papel filme', category: 'Limpeza', amount: 1, active: true, order: 72 },
  { name: 'Papel aluminio', category: 'Limpeza', amount: 1, active: true, order: 73 },
  { name: 'Bombril', category: 'Limpeza', amount: 1, active: true, order: 74 },
  { name: 'Esponja', category: 'Limpeza', amount: 1, active: true, order: 75 },
  { name: 'Gel pato', category: 'Limpeza', amount: 1, active: true, order: 76 },
  { name: 'Desengordurante', category: 'Limpeza', amount: 1, active: true, order: 77 },
  { name: 'Desodorante de carro', category: 'Limpeza', amount: 2, active: true, order: 78 },
  { name: 'Xampu de carro', category: 'Limpeza', amount: 1, active: true, order: 79 },
  { name: 'Xampu darwin', category: 'Limpeza', amount: 1, active: true, order: 80 },

  // Higiene
  { name: 'Lenço umidecido', category: 'Higiene', amount: 1, active: true, order: 81 },
  { name: 'O.B', category: 'Higiene', amount: 1, active: true, order: 82 },
  { name: 'Escova de dente', category: 'Higiene', amount: 1, active: true, order: 83 },
  { name: 'Pasta de dente', category: 'Higiene', amount: 2, active: true, order: 84 },
  { name: 'Anti-séptico', category: 'Higiene', amount: 1, active: true, order: 85 },
  { name: 'Fio dental', category: 'Higiene', amount: 1, active: true, order: 86 },
  { name: 'Sabonete fem', category: 'Higiene', amount: 4, active: true, order: 87 },
  { name: 'Sabonete mas', category: 'Higiene', amount: 5, active: true, order: 88 },
  { name: 'Sabonete intimo', category: 'Higiene', amount: 1, active: true, order: 89 },
  { name: 'Sabonete líquido', category: 'Higiene', amount: 2, active: true, order: 90 },
  { name: 'Desodorante fem', category: 'Higiene', amount: 2, active: true, order: 91 },
  { name: 'Desodorante mas', category: 'Higiene', amount: 2, active: true, order: 92 },
  { name: 'Xampu', category: 'Higiene', amount: 1, active: true, order: 93 },
  { name: 'Condicionador', category: 'Higiene', amount: 1, active: true, order: 94 },
  { name: 'Mascara de cabelo', category: 'Higiene', amount: 1, active: true, order: 95 },
  { name: 'Barla', category: 'Higiene', amount: 1, active: true, order: 96 },
  { name: 'Algodão', category: 'Higiene', amount: 1, active: true, order: 97 },
  { name: 'Contonete', category: 'Higiene', amount: 1, active: true, order: 98 },
  { name: 'Removedor de esmalte', category: 'Higiene', amount: 1, active: true, order: 99 },
  { name: 'Oleo corporal', category: 'Higiene', amount: 1, active: true, order: 100 },
  { name: 'Hidratante', category: 'Higiene', amount: 1, active: true, order: 101 },
  { name: 'Gel', category: 'Higiene', amount: 1, active: true, order: 102 },
  { name: 'Creme de barbear', category: 'Higiene', amount: 1, active: true, order: 103 },
  { name: 'Lâmina', category: 'Higiene', amount: 1, active: true, order: 104 },
  { name: 'Papel higiênico', category: 'Higiene', amount: 1, active: true, order: 105 },
];

export async function seedItems() {
  const itemsRef = collection(db, 'items');

  const snapshot = await getDocs(itemsRef);

  if (!snapshot.empty) {
    throw new Error('Coleção já possui itens.');
  }

  const batch = writeBatch(db);

  items.forEach((item) => {
    batch.set(doc(itemsRef), item);
  });

  await batch.commit();

  return items.length;
}