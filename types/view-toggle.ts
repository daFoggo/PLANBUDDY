export interface IViewToggleProps {
  onViewChange: (view: "list" | "grid") => void;
  defaultView?: "list" | "grid";
}
