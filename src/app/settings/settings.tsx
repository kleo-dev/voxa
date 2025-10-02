"use client";

import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StringMap } from "@/types/typeUtils";

export type SettingsSchema = StringMap<
  "boolean" | "string" | "number" | string[]
>;

export default function Settings<T>({
  settings,
  setSettings,
  schema,
}: {
  settings: T;
  setSettings: Dispatch<SetStateAction<T>>;
  schema: SettingsSchema;
}) {
  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const renderInput = (key: string, type: any) => {
    if (Array.isArray(type)) {
      // Dropdown
      return (
        <Select
          value={(settings as any)[key]}
          onValueChange={(val) => handleChange(key, val)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={key} />
          </SelectTrigger>
          <SelectContent>
            {type.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else if (type === "boolean") {
      // Checkbox
      return (
        <Checkbox
          checked={(settings as any)[key]}
          onCheckedChange={(val) => handleChange(key, val)}
        />
      );
    } else if (type === "string") {
      // Text input
      return (
        <Input
          type="text"
          value={(settings as any)[key]}
          onChange={(e) => handleChange(key, e.target.value)}
        />
      );
    } else if (type === "number") {
      // Number input
      return (
        <Input
          type="number"
          value={(settings as any)[key]}
          onChange={(e) => handleChange(key, Number(e.target.value))}
        />
      );
    }
  };

  return (
    <>
      {Object.entries(schema).map(([key, type]) => (
        <div key={key} className="flex items-center justify-between space-x-4">
          <label className="capitalize">{key}</label>
          {renderInput(key, type)}
        </div>
      ))}
    </>
  );
}
