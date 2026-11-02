
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="not-found">
      <div>
        <span className="error-number">404</span>
        <h1>Page not found</h1>
        <p>
          The page you are looking for does not exist.
        </p>

        <Link to="/" className="btn-main">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
