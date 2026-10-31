import { titleCase } from '@/lib/text/titleCase';

import * as S from './styles';

interface RoutineChipsProps {
  routines: string[];
  selected: string;
  isOn: boolean;
  isDisabled: boolean;
  onSelect: (routine: string) => void;
}

export default function RoutineChips({ routines, selected, isOn, isDisabled, onSelect }: RoutineChipsProps) {
  const renderChip = (routine: string) => {
    const isSelected = routine === selected;
    const handleClick = () => onSelect(routine);
    return (
      <S.Chip
        key={routine}
        type="button"
        $isSelected={isSelected}
        $isOn={isOn}
        aria-pressed={isSelected}
        disabled={isDisabled}
        onClick={handleClick}
      >
        {titleCase(routine)}
      </S.Chip>
    );
  };

  return <S.Scroller role="group" aria-label="Routine">{routines.map(renderChip)}</S.Scroller>;
}
