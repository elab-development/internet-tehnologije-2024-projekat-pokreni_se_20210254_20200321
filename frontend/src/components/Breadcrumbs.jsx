import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const paths = location.pathname.split("/").filter((path) => path);

  // Ako smo na početnoj stranici, ne prikazujemo breadcrumbs
  if (location.pathname === "/") return null;

  return (
    <nav className="breadcrumbs">
      <Link to="/">🏠 Home</Link>
      {paths.map((path, index) => {
        const routeTo = `/${paths.slice(0, index + 1).join("/")}`;
        return <Link key={index} to={routeTo}> / {path}</Link>;
      })}
    </nav>
  );
};

export default Breadcrumbs;