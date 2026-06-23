import { db } from '~/services/firebase';
import {
  collection,
  getDocs,
  writeBatch,
  doc,
} from 'firebase/firestore';

const items = [
  // Alimentos
  { name: 'Refrigerante zero lt', category: 'Alimentos', amount: 48, active:true },
  { name: 'Arroz', category: 'Alimentos', amount: 2, active:true },
  { name: 'Feijão preto', category: 'Alimentos', amount: 1, active:true },
  { name: 'Feijão carioca', category: 'Alimentos', amount: 1, active:true },
  { name: 'Açucar', category: 'Alimentos', amount: 1, active:true },
  { name: 'Farinha de trigo', category: 'Alimentos', amount: 3, active:true},
  { name: 'Fermento biológico', category: 'Alimentos', amount: 6, active:true },
  { name: 'Macarrão parafuso', category: 'Alimentos', amount: 4, active:true },
  { name: 'Macarrao para Yakisoba', category: 'Alimentos', amount: 1, active:true },
  { name: 'Queijo ralado', category: 'Alimentos', amount: 4, active:true },
  { name: 'Cuscuz', category: 'Alimentos', amount: 1, active:true },
  { name: 'Milho', category: 'Alimentos', amount: 4, active:true },
  { name: 'Extrato de tomate', category: 'Alimentos', amount: 2, active:true },
  { name: 'Milho de pipoca', category: 'Alimentos', amount: 1, active:true },
  { name: 'Farinha', category: 'Alimentos', amount: 1, active:true },
  { name: 'Creme de leite', category: 'Alimentos', amount: 6, active:true },
  { name: 'Leite condensado', category: 'Alimentos', amount: 2, active:true },
  { name: 'Cacau em po', category: 'Alimentos', amount: 1, active:true },
  { name: 'Goiabada', category: 'Alimentos', amount: 1, active:true },
  { name: 'Café', category: 'Alimentos', amount: 1, active:true },
  { name: 'Filtro café 102', category: 'Alimentos', amount: 1, active:true },
  { name: 'Café máquina', category: 'Alimentos', amount: 1, active:true },
  { name: 'Aveia', category: 'Alimentos', amount: 3, active:true },
  { name: 'Margarina com sal', category: 'Alimentos', amount: 1, active:true },

  // Pets
  { name: 'Patê gatos', category: 'Pets', amount: 4, active:true },
  { name: 'Patê cachorro', category: 'Pets', amount: 4, active:true },
  { name: 'Ração darwin', category: 'Pets', amount: 1, active:true },
  { name: 'Ração gatos', category: 'Pets', amount: 1, active:true },
  { name: 'Petisco', category: 'Pets', amount: 2, active:true },
  
  // Condimentos
  { name: 'Shoyu', category: 'Condimentos', amount: 1, active:true },
  { name: 'Mostarda', category: 'Condimentos', amount: 1, active:true },
  { name: 'Ketchup', category: 'Condimentos', amount: 1, active:true },
  { name: 'Vinagre', category: 'Condimentos', amount: 1, active:true },
  { name: 'Oleo', category: 'Condimentos', amount: 1, active:true },
  { name: 'Sal', category: 'Condimentos', amount: 1, active:true },
  { name: 'Alho', category: 'Condimentos', amount: 1, active:true },

  // Temperos
  { name: 'Lemom pepper', category: 'Temperos', amount: 1, active:true },
  { name: 'Chimichurri', category: 'Temperos', amount: 2, active:true },
  { name: 'Paprica defumada', category: 'Temperos', amount: 1, active:true },
  { name: 'Noz moscada', category: 'Temperos', amount: 1, active:true },
  { name: 'Alho, salsa e cebola', category: 'Temperos', amount: 1, active:true },
  { name: 'Fumaca em po', category: 'Temperos', amount: 1, active:true },
  { name: 'P. calabresa', category: 'Temperos', amount: 3, active:true },
  { name: 'Acafrao', category: 'Temperos', amount: 3, active:true },
  { name: 'Coloral', category: 'Temperos', amount: 3, active:true },
  { name: 'Cominho', category: 'Temperos', amount: 1, active:true },
  { name: 'Louro', category: 'Temperos', amount: 1, active:true },

  // Carnes e Frios
  { name: 'Brócolis 600gr', category: 'Carnes e Frios', amount: 1, active:true },
  { name: 'Queijo cheddar 400gr', category: 'Carnes e Frios', amount: 1, active:true },
  { name: 'Bacon', category: 'Carnes e Frios', amount: 1, active:true },
  { name: 'Batata congelada', category: 'Carnes e Frios', amount: 1, active:true },
  { name: 'Frango 8kg', category: 'Carnes e Frios', amount: 8, active:true },
  { name: 'Carne moída 6kg', category: 'Carnes e Frios', amount: 6, active:true },
  { name: 'Carne em tiras 600gr', category: 'Carnes e Frios', amount: 0.6, active:true },
  { name: 'Ovos', category: 'Carnes e Frios', amount: 1, active:true },

  // Limpeza
  { name: 'Detergente', category: 'Limpeza', amount: 2, active:true },
  { name: 'Sabão de coco', category: 'Limpeza', amount: 1, active:true },
  { name: 'Água sanitária', category: 'Limpeza', amount: 1, active:true },
  { name: 'Sabão líquido', category: 'Limpeza', amount: 2, active:true },
  { name: 'Amaciante', category: 'Limpeza', amount: 1, active:true },
  { name: 'Inseticida', category: 'Limpeza', amount: 2, active:true },
  { name: 'Citronela', category: 'Limpeza', amount: 1, active:true },
  { name: 'Bom ar', category: 'Limpeza', amount: 1, active:true },
  { name: 'Desinfetante', category: 'Limpeza', amount: 1, active:true },
  { name: 'Essência', category: 'Limpeza', amount: 1, active:true },
  { name: 'Limpa vidro', category: 'Limpeza', amount: 1, active:true },
  { name: 'Óleo de peroba', category: 'Limpeza', amount: 1, active:true },
  { name: 'Veja', category: 'Limpeza', amount: 1, active:true },
  { name: 'Álcool', category: 'Limpeza', amount: 1, active:true },
  { name: 'Toalha de papel', category: 'Limpeza', amount: 1, active:true },
  { name: 'Saco para frezer', category: 'Limpeza', amount: 1, active:true },
  { name: 'Papel filme', category: 'Limpeza', amount: 1, active:true },
  { name: 'Papel aluminio', category: 'Limpeza', amount: 1, active:true },
  { name: 'Bombril', category: 'Limpeza', amount: 1, active:true },
  { name: 'Esponja', category: 'Limpeza', amount: 1, active:true },
  { name: 'Gel pato', category: 'Limpeza', amount: 1, active:true },
  { name: 'Desengordurante', category: 'Limpeza', amount: 1, active:true },
  { name: 'Desodorante de carro', category: 'Limpeza', amount: 2, active:true },
  { name: 'Xampu de carro', category: 'Limpeza', amount: 1, active:true },
  { name: 'Xampu darwin', category: 'Limpeza', amount: 1, active:true },

  // Higiene
  { name: 'Lenço umidecido', category: 'Higiene', amount: 1, active:true },
  { name: 'O.B', category: 'Higiene', amount: 1, active:true },
  { name: 'Escova de dente', category: 'Higiene', amount: 1, active:true },
  { name: 'Pasta de dente', category: 'Higiene', amount: 2, active:true },
  { name: 'Anti-séptico', category: 'Higiene', amount: 1, active:true },
  { name: 'Fio dental', category: 'Higiene', amount: 1, active:true },
  { name: 'Sabonete fem', category: 'Higiene', amount: 4, active:true },
  { name: 'Sabonete mas', category: 'Higiene', amount: 5, active:true },
  { name: 'Sabonete intimo', category: 'Higiene', amount: 1, active:true },
  { name: 'Sabonete líquido', category: 'Higiene', amount: 2, active:true },
  { name: 'Desodorante fem', category: 'Higiene', amount: 2, active:true },
  { name: 'Desodorante mas', category: 'Higiene', amount: 2, active:true },
  { name: 'Xampu', category: 'Higiene', amount: 1, active:true },
  { name: 'Condicionador', category: 'Higiene', amount: 1, active:true },
  { name: 'Mascara de cabelo', category: 'Higiene', amount: 1, active:true },
  { name: 'Barla', category: 'Higiene', amount: 1, active:true },
  { name: 'Algodão', category: 'Higiene', amount: 1, active:true },
  { name: 'Contonete', category: 'Higiene', amount: 1, active:true },
  { name: 'Removedor de esmalte', category: 'Higiene', amount: 1, active:true },
  { name: 'Oleo corporal', category: 'Higiene', amount: 1, active:true },
  { name: 'Hidratante', category: 'Higiene', amount: 1, active:true },
  { name: 'Gel', category: 'Higiene', amount: 1, active:true },
  { name: 'Creme de barbear', category: 'Higiene', amount: 1, active:true },
  { name: 'Lâmina', category: 'Higiene', amount: 1, active:true },
  { name: 'Papel higiênico', category: 'Higiene', amount: 1, active:true },
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