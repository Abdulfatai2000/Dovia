"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { PasswordRequirements } from "./password-requirements";

export interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  autoComplete?: "current-password" | "new-password";
  placeholder?: string;
  helperText?: string;
  error?: string;
  showRequirements?: boolean;
}

export function PasswordInput({ id, name, label, autoComplete = "new-password", placeholder, helperText, error, showRequirements = false }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const action = visible ? "Hide" : "Show";
  return (
    <div className="relative min-w-0">
      <Input id={id} name={name} label={label} type={visible ? "text" : "password"} autoComplete={autoComplete}
        placeholder={placeholder} helperText={helperText} error={error} required className="pr-12"
        onChange={event => { if (showRequirements) setPassword(event.target.value); }}
        aria-describedby={showRequirements ? id + "-requirements" : undefined} />
      <IconButton size="sm" className="absolute top-8 right-1" aria-label={`${action} ${label.toLowerCase()}`}
        aria-pressed={visible} aria-controls={id} onClick={() => setVisible(current => !current)}>
        {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
      </IconButton>
      {showRequirements && <div className="mt-3"><PasswordRequirements password={password} id={id + "-requirements"} /></div>}
    </div>
  );
}
