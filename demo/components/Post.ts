import html from "../../lib/html/html";
import If from "../../lib/logic/If";
import { State } from "../../lib/reactivity/models/state";

const Post = (slug: State<string>, numberOfViews?: State<number>) => html`<p>
    The slug of this post is ${slug}
  </p>

  ${() =>
    If(
      () => numberOfViews !== undefined,
      () => html` <p>And the numberOfViews is ${() => numberOfViews() / 2}</p> `
    )} `;

export default Post;
