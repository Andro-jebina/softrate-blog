import { Link } from 'react-router-dom';

// Edit the text below to change the About page content
export default function About() {
  return (
    <section className="container section narrow">
      <h1 className="page-title">About Softrate</h1>
      <p>
        Softrate is a technology company focused on building reliable, easy-to-use software for
        businesses. Our team works across web development, cloud infrastructure and data, and we
        enjoy sharing what we learn along the way.
      </p>

      <h2>Why this blog?</h2>
      <p>
        The Softrate blog is where we publish practical articles for developers, founders and anyone
        curious about technology. We write about real problems we have solved, tools we use, and
        lessons from our projects, in plain language and without unnecessary jargon.
      </p>

      <h2>What you will find here</h2>
      <ul className="plain-list">
        <li>Tutorials and how-to guides for developers</li>
        <li>Notes on tools, frameworks and best practices</li>
        <li>Updates and ideas from the Softrate team</li>
      </ul>

      <p>
        Have a question or a topic you would like us to cover? <Link to="/contact">Get in touch</Link>.
      </p>
    </section>
  );
}
