import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import LoadingSpinner from "./ui/LoadingSpinner";

const PageManager = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    let title = "Home";

    if (path === "/") {
      title = "Home";
    } else if (path === "/teams") {
      title = "Teams";
    } else if (path === "/login") {
      title = "Login";
    } else if (path === "/signup") {
      title = "Signup";
    }

    document.title = `NBA Predictor - ${title}`;

    // TO-DO look into this
    // Use setTimeout to avoid the "Calling setState synchronously within an effect" warning in React 19
    setTimeout(() => {
      setIsTransitioning(true);
    }, 0);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {children}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
};

export default PageManager;
