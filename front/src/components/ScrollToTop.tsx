import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    //cum se schimba calea, ma muta sus de tot
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; //nu returnez nimic vizual, doar efectul de scroll
}