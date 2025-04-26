import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Lazy load components (must be at the top of the file)
const Layout = React.lazy(() => import("../components/Layout"));
const PostsList = React.lazy(() => import("../components/PostsList"));
const SharedPostlist = React.lazy(() => import("../components/SharedPostlist"));
const LearningStatus = React.lazy(() => import("./LearningStatus"));
const LearningPlan = React.lazy(() => import("./LearningPlan"));

// UI Elements
import { TETabs, TETabsItem } from "tw-elements-react";

// Context
import { useActiveTab } from "../context/ActiveTabContext";

const Home = () => {
  // Context
  const { activeTab, setActiveTab } = useActiveTab();

  // States
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const [reFetchPost, setReFetchPost] = useState(false);
  const [reFetchSharedPost, setReFetchSharedPost] = useState(false);

  // Fetch all posts on mount and when reFetchPost changes
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/posts");
        setPosts(data);
      } catch (error) {
        toast.error("Server error");
      }
    };
    fetchAllPosts();
  }, [reFetchPost]);

  // Fetch shared posts when reFetchSharedPost changes
  useEffect(() => {
    const fetchAllSharedPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/share");
        setSharedPosts(data);
      } catch (error) {
        toast.error("Server error");
      }
    };
    fetchAllSharedPosts();
  }, [reFetchSharedPost]);

  // Get user info from localStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const userData = localStorage.getItem("user");
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUser();
  }, []);

  // Update post in state
  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  // Remove post from state
  const deletePost = (deletedPost) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPost.id)
    );
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Layout>
        <div className="mb-3">
          <TETabs fill>
            <TETabsItem
              onClick={() => setActiveTab("tab1")}
              active={activeTab === "tab1" || activeTab === ""}
              color="primary"
            >
              Daily Post
            </TETabsItem>
            <TETabsItem
              onClick={() => setActiveTab("tab2")}
              active={activeTab === "tab2"}
              color="primary"
            >
              Learning Status
            </TETabsItem>
            <TETabsItem
              onClick={() => setActiveTab("tab3")}
              active={activeTab === "tab3"}
              color="primary"
            >
              Learning Plan
            </TETabsItem>
          </TETabs>
        </div>

        {/* Daily Post Tab */}
        {activeTab === "tab1" && (
          <div>
            {posts?.map((post, index) => (
              <PostsList
                key={index}
                post={post}
                user={user}
                onUpdatePost={updatePost}
                onDeletePost={deletePost}
                reFetchPost={reFetchPost}
                setReFetchPost={setReFetchPost}
                setReFetchSharedPost={setReFetchSharedPost}
                reFetchSharedPost={reFetchSharedPost}
              />
            ))}

            {sharedPosts?.map((sharePost, index) => (
              <SharedPostlist
                key={index}
                post={sharePost}
                user={user}
                reFetchSharedPost={reFetchSharedPost}
                setReFetchSharedPost={setReFetchSharedPost}
              />
            ))}
          </div>
        )}

        {/* Learning Status Tab */}
        {activeTab === "tab2" && (
          <div>
            <LearningStatus user={user} />
          </div>
        )}

        {/* Learning Plan Tab */}
        {activeTab === "tab3" && (
          <div>
            <LearningPlan user={user} />
          </div>
        )}
      </Layout>
    </Suspense>
  );
};

export default Home;
