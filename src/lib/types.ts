export type LetterIndex = 0 | 1 | 2 | 3 | 4;

export type LetterStates = 'not-found' | 'wrong-position' | 'right-position';

export type BackgroundColors = 'bg-gray-500' | 'bg-yellow-500' | 'bg-green-500';

export type WordleRowLetterValue = {
  letter: string;
  letterState: LetterStates;
};

export type WordleRow = {
  0: WordleRowLetterValue;
  1: WordleRowLetterValue;
  2: WordleRowLetterValue;
  3: WordleRowLetterValue;
  4: WordleRowLetterValue;
  rowLocked: boolean;
};
