// Import necessary dependencies and components
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { TETabs, TETabsItem } from "tw-elements-react";
import PostsList from "../components/PostsList";
import axios from "axios";
import toast from "react-hot-toast";
import LearningStatus from "./LearningStatus";
import LearningPlan from "./LearningPlan";

import { useActiveTab } from "../context/ActiveTabContext";
import { SharedPostlist } from "../components/SharedPostlist";

// Define the Home functional component
const Home = () => {
  // Get the currently active tab and function to change it from context
  const { activeTab, setActiveTab } = useActiveTab();

  // State to store user information
  const [user, setUser] = useState(null);

  // States to control re-fetching posts and shared posts
  const [reFetchPost, setReFetchPost] = useState(false);
  const [reFetchSharedPost, setReFetchSharedPost] = useState(false);

  // State to store normal posts and shared posts
  const [posts, setPosts] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);

  // Fetch all posts on component mount
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/posts");
        setPosts(data); // Store posts in state
      } catch (error) {
        toast.error("Server error"); // Show error toast on failure
      }
    };
    fetchAllPosts();
  }, []);

  // Fetch user data from local storage with a simulated delay
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
        const userData = localStorage.getItem("user");
        setUser(JSON.parse(userData)); // Parse and set user data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Function to update a post in the state
  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  // Function to delete a post from the state
  const deletePost = (deletedPost) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPost.id)
    );
  };

  // Re-fetch posts whenever reFetchPost state changes
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/posts");
        setPosts(data); // Update state with latest posts
      } catch (error) {
        toast.error("Server error");
      }
    };
    fetchAllPosts();
  }, [reFetchPost]);

  // Re-fetch shared posts whenever reFetchSharedPost state changes
  useEffect(() => {
    const fetchAllSharedPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/share");
        setSharedPosts(data); // Update state with latest shared posts
      } catch (error) {
        toast.error("Server error");
      }
    };
    fetchAllSharedPosts();
  }, [reFetchSharedPost]);

  return (
    <Layout>
      <>
        {/* Tabs for switching views */}
        <div className="mb-3 ">
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

        {/* Tab 1: Daily Posts */}
        {activeTab === "tab1" && (
          <div>
            {/* Render user-created posts */}
            {posts?.map((post, index) => {
              return (
                <PostsList
                  post={post}
                  user={user}
                  key={index}
                  onUpdatePost={updatePost}
                  onDeletePost={deletePost}
                  reFetchPost={reFetchPost}
                  setReFetchPost={setReFetchPost}
                  setReFetchSharedPost={setReFetchSharedPost}
                  reFetchSharedPost={reFetchSharedPost}
                />
              );
            })}

            {/* Render shared posts */}
            {sharedPosts?.map((sharePost, index) => {
              return (
                <SharedPostlist
                  post={sharePost}
                  user={user}
                  key={index}
                  reFetchSharedPost={reFetchSharedPost}
                  setReFetchSharedPost={setReFetchSharedPost}
                />
              );
            })}
          </div>
        )}

        {/* Tab 2: Learning Status */}
        {activeTab === "tab2" && (
          <div>
            {/* Render the user's learning status */}
            <LearningStatus user={user} />
          </div>
        )}

        {/* Tab 3: Learning Plan */}
        {activeTab === "tab3" && (
          <div>
            {/* Render the user's learning plan */}
            <LearningPlan user={user} />
          </div>
        )}
      </>
    </Layout>
  );
};

export default Home;
