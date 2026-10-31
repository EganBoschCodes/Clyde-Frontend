import * as S from './styles';

interface PowerButtonProps {
  isOn: boolean;
  isPending: boolean;
  label: string;
  isDisabled: boolean;
  onToggle: () => void;
}

export default function PowerButton({ isOn, isPending, label, isDisabled, onToggle }: PowerButtonProps) {
  return (
    <S.Button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      aria-busy={isPending}
      $isOn={isOn}
      $isPending={isPending}
      onClick={onToggle}
      disabled={isDisabled}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M12 3v8.5" />
        <path d="M6.3 6.8a8 8 0 1 0 11.4 0" />
      </svg>
    </S.Button>
  );
}
