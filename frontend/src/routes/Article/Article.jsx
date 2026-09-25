import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import ArticleMeta from "../../components/ArticleMeta";
import ArticlesButtons from "../../components/ArticlesButtons";
import ArticleTags from "../../components/ArticleTags";
import BannerContainer from "../../components/BannerContainer";
import { useAuth } from "../../context/AuthContext";
import { recordView } from "../../helpers/recentlyViewed";
import getArticle from "../../services/getArticle";

function Article() {
  const { state } = useLocation();
  const [article, setArticle] = useState(state || {});
  const { title, body, tagList, createdAt, author } = article || {};
  const { headers, isAuth } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    if (state) return;

    getArticle({ slug, headers })
      .then(setArticle)
      .catch((error) => {
        console.error(error);
        navigate("/not-found", { replace: true });
      });
  }, [isAuth, slug, headers, state, navigate]);

  // REQ-061: record this article as recently viewed once its data is
  // available, without altering the fetch/navigation-state behavior above
  // (REQ-043). Pure side effect — does not affect what's rendered.
  useEffect(() => {
    if (!title) return;

    recordView(article);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, title]);

  return (
    <div className="article-page">
      <BannerContainer>
        <h1>{title}</h1>
        <ArticleMeta author={author} createdAt={createdAt}>
          <ArticlesButtons article={article} setArticle={setArticle} />
        </ArticleMeta>
      </BannerContainer>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            {body && <Markdown options={{ forceBlock: true }}>{body}</Markdown>}
            <ArticleTags tagList={tagList} />
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <ArticleMeta author={author} createdAt={createdAt}>
            <ArticlesButtons article={article} setArticle={setArticle} />
          </ArticleMeta>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default Article;
