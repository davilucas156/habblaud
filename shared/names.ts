import { hash32 } from './hash';

export interface PersonName {
  name: string;
  look: 'f' | 'm';
}

// Nomes brasileiros para os personagens. Sem duplicatas e sem variações quase iguais
// (ex.: Thiago/Tiago), para que cada personagem seja inconfundível no escritório.

const F = [
  'Sakura', 'Hinata', 'Bulma', 'Misty', 'Zelda', 'Leia', 'Hermione', 'Katniss', 'Eleven', 'Mikasa',
  'Nami', 'Robin', 'Tsunade', 'Videl', 'Android18', 'Serena', 'Chichi', 'Jessie', 'Lara', 'Jill',
  'Claire', 'Ada', 'Tifa', 'ChunLi', 'Yennefer', 'Ciri', 'Daenerys', 'Arya', 'Sansa', 'Wanda',
  'Natasha', 'Gamora', 'Nebula', 'Ahsoka', 'Padmé', 'Rey', 'Moana', 'Elsa', 'Mulan', 'Coraline',
  'Violet', 'Wednesday', 'Morticia', 'Velma', 'Daphne', 'Barbie', 'Raven', 'Starfire', 'Fiona', 'Marge',
  'Lisa', 'Barbie', 'Peach', 'Daisy', 'Rosalina', 'Eevee', 'Jigglypuff', 'Ellie', 'Jinx', 'Vi',
];

const M = [
  'Naruto', 'Minato', 'Goku', 'Ash', 'Vegeta', 'Sasuke', 'Itachi', 'Kakashi', 'Luffy', 'Zoro',
  'Sanji', 'Gohan', 'Piccolo', 'Trunks', 'Ichigo', 'Eren', 'Levi', 'Tanjiro', 'Gojo', 'Saitama',
  'Genos', 'Madara', 'Obito', 'Light', 'Jiraiya', 'Gaara', 'Inuyasha', 'Freeza', 'Yusuke', 'Hiei',
  'Kurama', 'Gon', 'Killua', 'Hisoka', 'Deku', 'Bakugo', 'Todoroki', 'Pikachu', 'Charizard', 'Mewtwo',
  'Lucario', 'Gengar', 'Squirtle', 'Bulbasaur', 'Charmander', 'Snorlax', 'Brock', 'James', 'Alucard', 'Kaneki',
  'Yugi', 'Kaiba', 'Seiya', 'Link', 'Mario', 'Luigi', 'Sonic', 'Kratos', 'Geralt', 'Anakin',
];
export const NAME_POOL: readonly PersonName[] = Object.freeze(
  // Intercala para que nomes vizinhos no pool alternem a dica visual.
  F.flatMap((f, i) => [{ name: f, look: 'f' as const }, ...(M[i] ? [{ name: M[i], look: 'm' as const }] : [])]),
);

/**
 * Escolhe um nome determinístico para `id`, evitando os já usados.
 * Se o pool esgotar, acrescenta um sufixo numérico ("Ana 2").
 */
export function pickName(id: string, used: ReadonlySet<string>): PersonName {
  const n = NAME_POOL.length;
  const start = hash32(id) % n;
  for (let i = 0; i < n; i++) {
    const cand = NAME_POOL[(start + i) % n];
    if (!used.has(cand.name)) return cand;
  }
  const base = NAME_POOL[start];
  for (let k = 2; ; k++) {
    const name = `${base.name} ${k}`;
    if (!used.has(name)) return { name, look: base.look };
  }
}
