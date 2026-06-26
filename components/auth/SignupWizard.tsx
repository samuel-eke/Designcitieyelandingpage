"use client";

import { SignupForm } from "./SignupForm";

export function SignupWizard({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  return <SignupForm onSwitchToLogin={onSwitchToLogin} />;
}
