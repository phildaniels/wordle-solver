import { useCallback, useEffect, useRef, useState } from 'react';
import WordleRow from './components/wordle-row';
import { WordleRowLetterValue, WordleRow as WordleRowType } from './lib/types';
import { Button } from './components/ui/button';
import { Plus, Download, Trash, Calculator } from 'lucide-react';
import { dictionary } from './assets/probabilities';
import { Skeleton } from './components/ui/skeleton';
import { constructFilter, generateTop10Guesses } from './lib/utils';

const defaultRow: WordleRowType = {
  [0]: { letter: '', letterState: 'not-found' },
  [1]: { letter: '', letterState: 'not-found' },
  [2]: { letter: '', letterState: 'not-found' },
  [3]: { letter: '', letterState: 'not-found' },
  [4]: { letter: '', letterState: 'not-found' },
  rowLocked: false,
};

const App = () => {
  const [rows, setRows] = useState<Array<WordleRowType>>([]);
  const allPossibleGuesses = useRef<string[]>([]);
  const lockedRows = useRef<Array<WordleRowType>>([]);
  const [top10Guesses, setTop10Guesses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const onRowCompleted = useCallback((index: number, row: WordleRowType) => {
    setRows((prev) => {
      const newRows = [...prev];
      newRows[index] = row;
      lockedRows.current = newRows.filter((row) => !!row.rowLocked);
      return newRows;
    });
  }, []);

  const onRowDeleted = useCallback(
    (wordIndex: number) => {
      if (rows.length <= 1) {
        setRows([]);
        setTop10Guesses([]);
        lockedRows.current = [];
        allPossibleGuesses.current = dictionary;
        return;
      }
      lockedRows.current = rows
        .filter((_, index) => wordIndex !== index)
        .filter((row) => !!row.rowLocked);
      setRows((prev) => prev.filter((_, index) => wordIndex !== index));
    },
    [rows]
  );

  const addRow = (word?: string) => {
    const rowToAdd: WordleRowType = word
      ? {
          [0]: { letter: word[0], letterState: 'not-found' },
          [1]: { letter: word[1], letterState: 'not-found' },
          [2]: { letter: word[2], letterState: 'not-found' },
          [3]: { letter: word[3], letterState: 'not-found' },
          [4]: { letter: word[4], letterState: 'not-found' },
          rowLocked: false,
        }
      : defaultRow;
    setRows((prev) => [...prev, rowToAdd]);
  };

  const clearAllRows = () => {
    if (rows.length === 0) {
      return;
    }
    setRows([]);
    lockedRows.current = [];
    setTop10Guesses([]);
    allPossibleGuesses.current = dictionary;
  };

  const calculateGuesses = (rowsToCalculate: WordleRowType[]) => {
    setLoading(true);

    const filter = constructFilter(rowsToCalculate);

    const matchingWords =
      rowsToCalculate.length === 0 ? dictionary : dictionary.filter(filter);
    allPossibleGuesses.current = matchingWords;

    const top10Guesses = generateTop10Guesses(
      matchingWords,
      rowsToCalculate.length
    );

    setTop10Guesses(top10Guesses);
    setLoading(false);
  };

  useEffect(() => {
    calculateGuesses(lockedRows.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockedRows.current]);

  const downloadAllPossibleGuesses = () => {
    const element = document.createElement('a');
    const file = new Blob([allPossibleGuesses.current.join('\n')], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = 'all-possible-guesses.txt';
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="flex flex-col justify-start items-center">
      <div className="flex-1">
        <Button className="m-1" variant="ghost" onClick={() => addRow()}>
          <Plus className="mr-2 h-4 w-4" /> Add Row
        </Button>
        <Button
          className="m-1"
          variant="ghost"
          disabled={rows.length === 0}
          onClick={() => clearAllRows()}
        >
          <Trash className="mr-2 h-4 w-4" /> Clear Rows
        </Button>
      </div>
      <div className="flex-1 border-b">
        {rows.map((row, index) => {
          const key = Object.entries(row)
            .filter(([key]) => !isNaN(+key))
            .map(([, value]) => value as WordleRowLetterValue)
            .map(
              ({ letter, letterState }, index) =>
                `${letter}_${letterState}_${index}`
            )
            .join('');
          return (
            <WordleRow
              key={key}
              onRowCompleted={(row) => onRowCompleted(index, row)}
              onRowDeleted={() => onRowDeleted(index)}
              value={row}
            />
          );
        })}
      </div>
      <div className="flex-1 flex-col">
        <div className="flex flex-col">
          <h1 className="text-center">
            {rows.filter((row) => !!row.rowLocked).length > 0
              ? 'Best 10 Statistical Guesses'
              : '10 Great Starting Words'}
          </h1>
        </div>
        {loading && (
          <div className="flex flex-row">
            <div className="flex flex-col">
              <Skeleton className="m-1 h-10 w-28" />
              <Skeleton className="m-1 h-10 w-28" />
              <Skeleton className="m-1 h-10 w-28" />
              <Skeleton className="m-1 h-10 w-28" />
              <Skeleton className="m-1 h-10 w-28" />
            </div>
            <div className="flex flex-col">
              <Skeleton className="m-1 h-10 w-28" />
              <Skeleton className="m-1 h-10 w-28" />
              <Skeleton className="m-1 h-10 w-28" />
              <Skeleton className="m-1 h-10 w-28" />
              <Skeleton className="m-1 h-10 w-28" />
            </div>
          </div>
        )}
        {!loading && (
          <div className="flex flex-row">
            <div className="flex flex-col">
              {top10Guesses.slice(0, 5).map((guess, index) => (
                <Button
                  key={guess}
                  className="m-1 flex-1"
                  variant="ghost"
                  onClick={() => addRow(guess)}
                >
                  <Plus className="mr-2 h-4 w-4" /> ({index + 1}) {guess}
                </Button>
              ))}
            </div>
            <div className="flex flex-col">
              {top10Guesses.slice(5, 10).map((guess, index) => (
                <Button
                  key={guess}
                  className="m-1 flex-1"
                  variant="ghost"
                  onClick={() => addRow(guess)}
                >
                  <Plus className="mr-2 h-4 w-4" /> ({index + 6}) {guess}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 flex-col">
        <Button
          className="m-1"
          variant="ghost"
          onClick={() => downloadAllPossibleGuesses()}
        >
          <Download className="mr-2 h-4 w-4" /> Download All Potential Words
        </Button>
        <Button
          className="m-1"
          variant="ghost"
          onClick={() => calculateGuesses(lockedRows.current)}
        >
          <Calculator className="mr-2 h-4 w-4" /> Recalculate Guesses
        </Button>
      </div>
    </div>
  );
};

export default App;
