
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="site-page">
      <Navbar />

      <main>
        <section className="hero container">
          <div className="hero-copy">
            <span className="eyebrow">
              SIMPLE TASK MANAGEMENT
            </span>

            <h1>
              Manage your tasks.
              <span> Focus on what matters.</span>
            </h1>

            <p>
              Create tasks, organize your daily work,
              track progress and complete more with
              TaskFlow.
            </p>

            <div className="hero-actions">
              <Link to="/signup" className="btn-main">
                Get Started Free
              </Link>

              <Link to="/login" className="btn-soft">
                Log In
              </Link>
            </div>

            <div className="hero-highlights">
              <span>✓ Easy to use</span>
              <span>✓ Track progress</span>
              <span>✓ Stay organized</span>
            </div>
          </div>

          <div className="hero-preview">
            <div className="preview-window">
              <div className="preview-header">
                <span className="preview-dots">
                  ● ● ●
                </span>
                <span>My Workspace</span>
              </div>

              <h3>Today's Tasks</h3>
              <p>Make every day productive.</p>

              {[
                ["Complete project design", "Completed"],
                ["Review backend API", "In Progress"],
                ["Prepare presentation", "Todo"]
              ].map(([title, status]) => (
                <div className="preview-task" key={title}>
                  <span className="preview-check">✓</span>
                  <span>{title}</span>
                  <small>{status}</small>
                </div>
              ))}

              <div className="preview-progress">
                <div className="progress-info">
                  <strong>Daily Progress</strong>
                  <span>67%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">
                EVERYTHING YOU NEED
              </span>
              <h2>Stay on top of your work</h2>
              <p>
                Simple tools to manage your tasks
                without confusion.
              </p>
            </div>

            <div className="features-grid">
              {[
                {
                  icon: "+",
                  title: "Create Tasks",
                  text: "Add tasks with a title, description and status."
                },
                {
                  icon: "✎",
                  title: "Manage Tasks",
                  text: "Edit or delete tasks whenever you need."
                },
                {
                  icon: "✓",
                  title: "Track Progress",
                  text: "Organize work with clear task statuses."
                }
              ].map((feature) => (
                <div
                  className="feature-card"
                  key={feature.title}
                >
                  <span className="feature-icon">
                    {feature.icon}
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
