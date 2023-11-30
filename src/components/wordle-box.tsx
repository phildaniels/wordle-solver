import { Ref, forwardRef, useCallback, useEffect, useState } from 'react';
import { Input } from './ui/input';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { CaseSensitive } from 'lucide-react';
import colors from 'tailwindcss/colors';
import {
  BackgroundColors,
  LetterStates,
  WordleRowLetterValue,
} from '@/lib/types';

type WordleBoxProps = {
  locked: boolean;
  onChange: (letter: string, letterState: LetterStates) => void;
  value: WordleRowLetterValue;
};
const WordleBoxRenderFunction = (
  { locked, onChange, value }: WordleBoxProps,
  ref: Ref<HTMLInputElement>
) => {
  const { letter, letterState } = value;
  const [letterValue, setLetterValue] = useState<string>(letter);
  const [letterStateValue, setLetterStateValue] =
    useState<LetterStates>(letterState);
  const [textBoxBackgroundColor, setTextBoxBackgroundColor] =
    useState<BackgroundColors>('bg-gray-500');

  const calculateBackgroundColor = useCallback(
    (letterStateValue: LetterStates): BackgroundColors => {
      switch (letterStateValue) {
        case 'not-found':
          return 'bg-gray-500';
        case 'wrong-position':
          return 'bg-yellow-500';
        default:
          return 'bg-green-500';
      }
    },
    []
  );

  useEffect(() => {
    setTextBoxBackgroundColor(calculateBackgroundColor(letterStateValue));
  }, [letterStateValue, calculateBackgroundColor]);

  const textBoxChange = (letter: string) => {
    setLetterValue(letter);
    onChange(letter, letterStateValue);
  };

  const toggleGroupValueChange = (letterState: LetterStates) => {
    setLetterStateValue(letterState);
    onChange(letterValue, letterState);
  };

  return (
    <div className="flex flex-col items-center">
      {!locked && (
        <div className="m-1">
          <ToggleGroup
            className="flex flex-col"
            type="single"
            size="sm"
            onValueChange={(value: LetterStates) =>
              toggleGroupValueChange(value)
            }
            value={letterStateValue}
          >
            <ToggleGroupItem value="not-found" aria-label="Not Found Letter">
              <CaseSensitive color={colors.gray[500]} />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="wrong-position"
              aria-label="Wrong Position Letter"
            >
              <CaseSensitive color="gold" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="right-position"
              aria-label="Right Position Letter"
            >
              <CaseSensitive color={colors.green[500]} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}
      <Input
        type="text"
        ref={ref}
        disabled={locked}
        maxLength={1}
        onFocus={() => {
          if (locked) {
            return;
          }
          textBoxChange('');
        }}
        onChange={(event) => {
          if (locked) {
            return;
          }
          textBoxChange(event?.target?.value?.toUpperCase());
        }}
        value={letterValue}
        className={`m-1 w-11 ${textBoxBackgroundColor} text-white text-center disabled:opacity-100`}
      />
    </div>
  );
};

const WordleBox = forwardRef(WordleBoxRenderFunction);

export default WordleBox;
