import { useCallback, useEffect, useRef, useState } from 'react';
import WordleBox from './wordle-box';
import { Button } from './ui/button';
import { Check, Edit, Trash } from 'lucide-react';
import colors from 'tailwindcss/colors';
import {
  LetterIndex,
  LetterStates,
  WordleRowLetterValue,
  WordleRow as WordleRowType,
} from '@/lib/types';

type WordleRowProps = {
  onRowCompleted: (value: WordleRowType) => void;
  onRowDeleted: () => void;
  value: WordleRowType;
};

const blacklistedKeys = [
  'Alt',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'CapsLock',
  'ContextMenu',
  'Control',
  'Delete',
  'End',
  'Enter',
  'Escape',
  'Home',
  'Insert',
  'Meta',
  'NumLock',
  'NumpadEnter',
  'PageDown',
  'PageUp',
  'Pause',
  'ScrollLock',
  'Shift',
  'Tab',
  'PrintScreen',
];

const WordleRow = ({ onRowCompleted, onRowDeleted, value }: WordleRowProps) => {
  const [rowValue, setRowValue] = useState<WordleRowType>(value);

  useEffect(() => {
    setRowValue(value);
  }, [value]);

  const wordIsValid = Object.entries(rowValue)
    .filter(([key]) => {
      !isNaN(+key);
    })
    .map(([, value]) => value as WordleRowLetterValue)
    .every(({ letter }) => letter?.trim() !== '');

  const onChange = useCallback(
    (index: LetterIndex, letter: string, letterState: LetterStates) => {
      setRowValue((prev) => ({ ...prev, [index]: { letter, letterState } }));
    },
    []
  );

  const handleCheckClicked = () => {
    if (!wordIsValid) {
      return;
    }
    setRowValue((prev) => ({ ...prev, rowLocked: true }));
    onRowCompleted({ ...rowValue, rowLocked: true });
  };

  const handleEditClicked = () => {
    setRowValue((prev) => ({ ...prev, rowLocked: false }));
  };

  const wordLocked = rowValue.rowLocked;

  const boxZeroRef = useRef<HTMLInputElement>(null);
  const boxOneRef = useRef<HTMLInputElement>(null);
  const boxTwoRef = useRef<HTMLInputElement>(null);
  const boxThreeRef = useRef<HTMLInputElement>(null);
  const boxFourRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const boxZeroRefCurrent = boxZeroRef.current;
    const boxOneRefCurrent = boxOneRef.current;
    const boxTwoRefCurrent = boxTwoRef.current;
    const boxThreeRefCurrent = boxThreeRef.current;
    const boxFourRefCurrent = boxFourRef.current;
    if (
      boxZeroRefCurrent &&
      boxOneRefCurrent &&
      boxTwoRefCurrent &&
      boxThreeRefCurrent &&
      boxFourRefCurrent
    ) {
      const onKeyUpFocus = (
        e: KeyboardEvent,
        refToFocus: HTMLInputElement,
        previousRef?: HTMLInputElement
      ) => {
        if (e.key === 'Backspace') {
          previousRef?.focus();
          return;
        }
        if (blacklistedKeys.includes(e.key)) {
          return;
        }
        refToFocus.focus();
      };
      const onKeyUpBlur = (
        e: KeyboardEvent,
        inputToBlur: HTMLInputElement,
        previousRef?: HTMLInputElement
      ) => {
        if (e.key === 'Backspace') {
          previousRef?.focus();
          return;
        }
        if (blacklistedKeys.includes(e.key)) {
          return;
        }
        inputToBlur.blur();
      };
      const boxZeroKeyupListener = (e: KeyboardEvent) =>
        onKeyUpFocus(e, boxOneRefCurrent);
      boxZeroRefCurrent.addEventListener('keyup', boxZeroKeyupListener);

      const boxOneKeyupListener = (e: KeyboardEvent) =>
        onKeyUpFocus(e, boxTwoRefCurrent, boxZeroRefCurrent);
      boxOneRefCurrent.addEventListener('keyup', boxOneKeyupListener);

      const boxTwoKeyupListener = (e: KeyboardEvent) =>
        onKeyUpFocus(e, boxThreeRefCurrent, boxOneRefCurrent);
      boxTwoRefCurrent.addEventListener('keyup', boxTwoKeyupListener);

      const boxThreeKeyupListener = (e: KeyboardEvent) =>
        onKeyUpFocus(e, boxFourRefCurrent, boxTwoRefCurrent);
      boxThreeRefCurrent.addEventListener('keyup', boxThreeKeyupListener);

      const boxFourKeyupListener = (e: KeyboardEvent) =>
        onKeyUpBlur(e, boxFourRefCurrent, boxThreeRefCurrent);
      boxFourRefCurrent.addEventListener('keyup', boxFourKeyupListener);

      return () => {
        if (
          boxZeroRefCurrent &&
          boxOneRefCurrent &&
          boxTwoRefCurrent &&
          boxThreeRefCurrent &&
          boxFourRefCurrent
        ) {
          boxZeroRefCurrent.removeEventListener('keyup', boxZeroKeyupListener);
          boxOneRefCurrent.removeEventListener('keyup', boxOneKeyupListener);
          boxTwoRefCurrent.removeEventListener('keyup', boxTwoKeyupListener);
          boxThreeRefCurrent.removeEventListener(
            'keyup',
            boxThreeKeyupListener
          );
          boxFourRefCurrent.removeEventListener('keyup', boxFourKeyupListener);
        }
      };
    }
  }, [
    boxZeroRef,
    boxOneRef,
    boxTwoRef,
    boxThreeRef,
    boxFourRef,
    value.rowLocked,
  ]);

  return (
    <div className="flex">
      <WordleBox
        locked={wordLocked}
        onChange={(letter: string, letterState: LetterStates) => {
          onChange(0, letter, letterState);
        }}
        value={rowValue[0]}
        ref={boxZeroRef}
      />
      <WordleBox
        locked={wordLocked}
        onChange={(letter: string, letterState: LetterStates) => {
          onChange(1, letter, letterState);
        }}
        value={rowValue[1]}
        ref={boxOneRef}
      />
      <WordleBox
        locked={wordLocked}
        onChange={(letter: string, letterState: LetterStates) => {
          onChange(2, letter, letterState);
        }}
        value={rowValue[2]}
        ref={boxTwoRef}
      />
      <WordleBox
        locked={wordLocked}
        onChange={(letter: string, letterState: LetterStates) => {
          onChange(3, letter, letterState);
        }}
        value={rowValue[3]}
        ref={boxThreeRef}
      />
      <WordleBox
        locked={wordLocked}
        onChange={(letter: string, letterState: LetterStates) => {
          onChange(4, letter, letterState);
        }}
        value={rowValue[4]}
        ref={boxFourRef}
      />
      <div className="self-end">
        {!wordLocked && (
          <Button
            className="m-1"
            variant="outline"
            size="icon"
            disabled={!wordIsValid}
            onClick={() => handleCheckClicked()}
          >
            <Check color={colors.green[500]} className="h-4 w-4" />
          </Button>
        )}
        {wordLocked && (
          <Button
            className="m-1"
            variant="outline"
            size="icon"
            onClick={() => handleEditClicked()}
          >
            <Edit color={colors.yellow[500]} className="h-4 w-4" />
          </Button>
        )}
        <Button
          className="m-1"
          variant="outline"
          size="icon"
          onClick={() => onRowDeleted()}
        >
          <Trash color={colors.red[500]} className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WordleRow;
