import html from "../../lib/html/html";

const Post = (slug, numberOfViews) => html`<p>
    The slug of this post is ${slug}
  </p>

  <p>
    And the numberOfViews is
    ${() => (numberOfViews !== undefined ? numberOfViews() / 2 : "")}
  </p> `;

export default Post;
