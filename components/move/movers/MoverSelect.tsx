"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Id } from "@/convex/_generated/dataModel";
import { useMoverCalendar } from "@/contexts/MoverCalendarContext";

type MoverSelectProps = {
  label?: string;
  placeholder?: string;
  className?: string;
};

export default function MoverSelect({
  label = "Mover",
  placeholder = "Select mover",
  className,
}: MoverSelectProps) {
  const { mover, setMover, moverOptions } = useMoverCalendar();

  return (
    <div className={className}>
      <div className="flex flex-col gap-1">
        <Label>{label}</Label>
        <Select
          value={(mover?.id as unknown as string) ?? "ALL"}
          onValueChange={(newValue) => {
            if (newValue === "ALL") {
              setMover(null);
              return;
            }
            const opt =
              moverOptions.find(
                (o) => o.id === (newValue as unknown as Id<"users">)
              ) || null;
            setMover(opt);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All movers</SelectItem>
            {moverOptions.map((m) => (
              <SelectItem key={m.id} value={m.id as unknown as string}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
