import { Link } from "react-router-dom";

function NotFound() {

    return (

        <div className="container text-center py-5">

            <h1 className="display-1 text-danger fw-bold">
                 🚫 404
            </h1>

            <h2 className="mb-3">
                Page Not Found
            </h2>

            <p className="text-muted mb-4">
                Sorry, the page you are looking for doesn't exist.
            </p>

            <Link
                to="/"
                className="btn btn-primary"
            >
                Back To Home
            </Link>

        </div>

    );

}

export default NotFound;