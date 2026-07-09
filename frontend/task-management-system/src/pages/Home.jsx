import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {

    return (

        <>

            <Navbar />

            <div className="container py-5">

                <div className="row align-items-center">

                    <div className="col-md-6">

                        <h1 className="display-4 fw-bold">

                            Task Management System

                        </h1>

                        <p className="lead mt-3">

                            Organize your daily work with ease.
                            Create, Update, Delete and Track your tasks efficiently.

                        </p>

                        <Link
                            to="/login"
                            className="btn btn-primary btn-lg me-3"
                        >
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            className="btn btn-success btn-lg"
                        >
                            Signup
                        </Link>

                    </div>

                    <div className="col-md-6 text-center">

                        <img
                            src="https://cdn-icons-png.flaticon.com/512/2620/2620977.png"
                            className="img-fluid"
                            width="350"
                            alt="Task"
                        />

                    </div>

                </div>

            </div>

            <div className="container py-5">

                <h2 className="text-center mb-5">

                    Features

                </h2>

                <div className="row">

                    <div className="col-md-4">

                        <div className="card shadow h-100">

                            <div className="card-body text-center">

                                <h3>📝</h3>

                                <h5>Create Tasks</h5>

                                <p>
                                    Create and manage your daily tasks easily.
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="card shadow h-100">

                            <div className="card-body text-center">

                                <h3>✏</h3>

                                <h5>Update Tasks</h5>

                                <p>
                                    Edit your tasks anytime.
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="card shadow h-100">

                            <div className="card-body text-center">

                                <h3>✅</h3>

                                <h5>Track Progress</h5>

                                <p>
                                    Filter tasks based on their status.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <Footer />

        </>

    );

}

export default Home;