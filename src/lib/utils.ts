import { probabilities } from '@/assets/probabilities';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WordleRow, WordleRowLetterValue } from './types';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const earlyGameSortHeuristic = (a: string, b: string) => {
  // heuristic here is to pick words with most unique vowels
  const aAsCharArray = [...a];
  const bAsCharArray = [...b];

  const aAsDistinctCharArray = [...new Set(aAsCharArray)];
  const bAsDistinctCharArray = [...new Set(bAsCharArray)];

  const uniqueVowelsInA = new Set(
    aAsDistinctCharArray.filter((letter) => 'AEIOU'.includes(letter))
  ).size;

  const uniqueVowelsInB = new Set(
    bAsDistinctCharArray.filter((letter) => 'AEIOU'.includes(letter))
  ).size;

  const differenceInUniqueVowelCount = uniqueVowelsInB - uniqueVowelsInA;
  if (differenceInUniqueVowelCount !== 0) {
    return differenceInUniqueVowelCount;
  }

  return lateGameSortHeuristic(a, b);
};

export const lateGameSortHeuristic = (a: string, b: string) => {
  // heuristic here picks the word that is most likely to
  // appear, based off of probabilities here
  // https://github.com/3b1b/videos/blob/master/_2022/wordle/data/freq_map.json
  const aProbability = probabilities[a] ?? 0;
  const bProbability = probabilities[b] ?? 0;
  return bProbability - aProbability;
};

export const constructFilter = (rows: WordleRow[]) => {
  
  for (const guess of rows) {
    const letters = Object
      .entries(guess)
      .filter(([key]) => !isNaN(+key))
      .map(([key, value]) => [+key, value as WordleRowLetterValue] as [number, WordleRowLetterValue])
    for (let i = 0; i < letters.length; i++) {
      const [index, {letter, letterState}] = letters[i];

      switch (letterState) {
        case 'right-position':
          if (letter !== word[index])
        case 'not-found':
        default:
        

    }
  }

  return filter;
};

export const generateTop10Guesses = (
  matchingWords: string[],
  rowLength: number
) => {
  return matchingWords
    .sort((a, b) => {
      if (rowLength < 1) {
        return earlyGameSortHeuristic(a, b);
      }

      return lateGameSortHeuristic(a, b);
    })
    .slice(0, 10);
};
