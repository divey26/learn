import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Components
import Layout from "../components/Layout";
import PostsList from "../components/PostsList";
import { SharedPostlist } from "../components/SharedPostlist";
import LearningStatus from "./LearningStatus";
import LearningPlan from "./LearningPlan";

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
    <Layout>
      <>
        {/* Tabs Navigation */}
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
      </>
    </Layout>
  );
};

export default Home;
