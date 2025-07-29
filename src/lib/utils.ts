import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Polish name declension function for vocative case
export function getPolishVocative(name: string): string {
  if (!name || name.trim() === '') return 'Dashboard';
  
  const trimmedName = name.trim();
  const lowerName = trimmedName.toLowerCase();
  
  // Common Polish names and their vocative forms
  const vocativeMap: { [key: string]: string } = {
    'jan': 'Janie',
    'piotr': 'Piotrze',
    'andrzej': 'Andrzeju',
    'krzysztof': 'Krzysztofie',
    'stanisław': 'Stanisławie',
    'tomasz': 'Tomaszu',
    'paweł': 'Pawle',
    'józef': 'Józefie',
    'marcin': 'Marcinie',
    'michał': 'Michale',
    'grzegorz': 'Grzegorzu',
    'jerzy': 'Jerzy',
    'tadeusz': 'Tadeuszu',
    'marek': 'Marku',
    'wojciech': 'Wojciechu',
    'jacek': 'Jacku',
    'rafał': 'Rafałe',
    'robert': 'Robercie',
    'dariusz': 'Dariuszu',
    'zbigniew': 'Zbigniewie',
    'henryk': 'Henryku',
    'mariusz': 'Mariuszu',
    'kamil': 'Kamilu',
    'adrian': 'Adrianie',
    'sebastian': 'Sebastianie',
    'dominik': 'Dominiku',
    'szymon': 'Szymonie',
    'damian': 'Damianie',
    'mateusz': 'Mateuszu',
    'kacper': 'Kacprze',
    'bartosz': 'Bartoszu',
    'dawid': 'Dawidzie',
    'wiktor': 'Wiktorze',
    'filip': 'Filipie',
    'konrad': 'Konradzie',
    'aleksander': 'Aleksandrze',
    'mikołaj': 'Mikołaju',
    'ignacy': 'Ignacy',
    'maksymilian': 'Maksymilianie',
    'oliver': 'Oliverze',
    'julian': 'Julianie',
    'fabian': 'Fabianie',
    'bruno': 'Bruno',
    'alexander': 'Aleksandrze',
    'daniel': 'Danielu',
    'jakub': 'Jakubie',
    'hubert': 'Hubertcie',
    'kajetan': 'Kajetanie',
    'leon': 'Leon',
    'marcel': 'Marcelu',
    'milan': 'Milanie',
    'nikodem': 'Nikodemie',
    'remigiusz': 'Remigiuszu',
    'sergiusz': 'Sergiuszu',
    'teodor': 'Teodorze',
    'walenty': 'Walenty',
    'witalis': 'Witalisie',
    'xawery': 'Xawery',
    'yves': 'Yves',
    'zenon': 'Zenonie',
    // Female names
    'anna': 'Anno',
    'maria': 'Mario',
    'katarzyna': 'Katarzyno',
    'małgorzata': 'Małgorzato',
    'agnieszka': 'Agnieszko',
    'krystyna': 'Krystyno',
    'barbara': 'Barbaro',
    'ewa': 'Ewo',
    'elżbieta': 'Elżbieto',
    'zofia': 'Zofio',
    'janina': 'Janino',
    'teresa': 'Tereso',
    'jolanta': 'Jolanto',
    'halina': 'Halino',
    'iwona': 'Iwono',
    'beata': 'Beato',
    'dorota': 'Doroto',
    'alicja': 'Alicjo',
    'monika': 'Moniko',
    'magdalena': 'Magdaleno',
    'joanna': 'Joanno',
    'natalia': 'Natalio',
    'karolina': 'Karolino',
    'aleksandra': 'Aleksandro',
    'paulina': 'Paulino',
    'wiktoria': 'Wiktorio',
    'gabriela': 'Gabrielo',
    'marta': 'Marto',
    'julia': 'Julio',
    'zuzanna': 'Zuzanno',
    'nikola': 'Nikolo',
    'maja': 'Majo',
    'amelia': 'Amelio',
    'lena': 'Leno',
    'ola': 'Olo',
    'hanna': 'Hanno',
    'laura': 'Lauro',
    'antonia': 'Antonio',
    'polina': 'Polino',
    'emilia': 'Emilio',
    'helena': 'Heleno',
    'lucia': 'Lucjo',
    'nadia': 'Nadio',
    'sara': 'Saro',
    'klara': 'Klaro',
    'ida': 'Ido',
    'mira': 'Miro',
    'nina': 'Nino',
    'roza': 'Rozo',
    'tola': 'Tolo',
    'ula': 'Ulo',
    'wera': 'Wero',
    'yola': 'Yolo',
    'zara': 'Zaro'
  };
  
  // Check if we have a direct mapping
  if (vocativeMap[lowerName]) {
    return vocativeMap[lowerName];
  }
  
  // Basic Polish declension rules for vocative case
  const lastChar = lowerName.slice(-1);
  const secondLastChar = lowerName.slice(-2, -1);
  
  // For names ending in consonants, add -ie or -e
  if (!['a', 'e', 'i', 'o', 'u', 'y'].includes(lastChar)) {
    // Soft consonants (ć, ś, ź, ż, dź) get -ie
    if (['ć', 'ś', 'ź', 'ż', 'dź'].includes(lastChar)) {
      return trimmedName + 'ie';
    }
    // Hard consonants get -e
    return trimmedName + 'e';
  }
  
  // For names ending in -a, replace with -o
  if (lastChar === 'a') {
    return trimmedName.slice(0, -1) + 'o';
  }
  
  // For names ending in -e, -i, -o, -u, -y, keep as is
  return trimmedName;
}
