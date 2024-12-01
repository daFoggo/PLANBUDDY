export interface ITimeSlotProps {
  slotKey: string;
  isSelected: boolean;
  onToggle: (slotKey: string) => void;
  onDragStart: (slotKey: string) => void;
  onDragEnd: () => void;
  onDragEnter: (slotKey: string) => void;
}
