import { navigate } from "gatsby";
import React from 'react'

export default function RedirectToAccountDashboard() {
  React.useEffect(() => {
    navigate("/account/dashboard", { replace: true });
  }, []);

  return null;
}