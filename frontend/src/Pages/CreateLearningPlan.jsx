import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import backgroundImg from "../images/Learning plan.jpg";
import { useActiveTab } from "../context/ActiveTabContext";
import toast from "react-hot-toast";
import axios from "axios";

const subjects = [
  "Select Learning Plan",
  "Programming",
  "Data Science",
  "Web Development",
  "Machine Learning",
  "Mathematics",
  "Others",
];

const CreateLearningPlan = () => {
  const [selectedsubjects, setSelectedsubjects] = useState(
    "Select Learning Plan"
  );
  const [learningPlanName, setLearningPlanName] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [schedule, setSchedule] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState({});
  const [editLearningPlans, setEditLearningPlans] = useState(false);
  const { setActiveTab } = useActiveTab();
  const { LearningPlanId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSingleLearningPlan = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/learningPlans/${LearningPlanId}`
        );
        console.log("Fetched learning plan data:", data);
        console.log("Fetched subjects:", data.subjects);
        setSelectedsubjects(
          data.subjects || data.subjectss || "Select Learning Plan"
        );
        setLearningPlanName(data.learningPlanName);
        setHoursPerDay(data.hoursPerDay);
        setSchedule(data.schedule || "");
        setDescription(data.description);
        setDate(data.date);
        setEditLearningPlans(true);
      } catch (error) {
        console.log(error);
      }
    };
    if (LearningPlanId) {
      fetchSingleLearningPlan();
    }
  }, [LearningPlanId]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (
      !selectedsubjects ||
      !learningPlanName ||
      !hoursPerDay ||
      !schedule ||
      !description
    ) {
      return toast.error("Please fill all the fields");
    }

    const planData = {
      userId: user.id,
      learningPlanName,
      subjects: selectedsubjects,
      hoursPerDay,
      schedule,
      date,
      description,
    };
    console.log(planData);

    try {
      const res = LearningPlanId
        ? await axios.put(
            `http://localhost:8080/learningPlans/${LearningPlanId}`,
            planData
          )
        : await axios.post(`http://localhost:8080/learningPlans`, planData);

      if (res.status === 200 || res.status === 201) {
        toast.success(
          LearningPlanId
            ? "Learning Plan Updated Successfully"
            : "Learning Plan Created Successfully"
        );
        setLearningPlanName("");
        setHoursPerDay("");
        setSchedule("");
        setDate("");
        setDescription("");
        setSelectedsubjects("");
        navigate("/");
        setActiveTab("tab3");
      }
    } catch (error) {
      toast.error("Failed to save learning plan");
    }
  };

  const goToLearningPlans = () => {
    navigate("/");
  };

  return (
    <Layout>
      <div
        className="min-h-screen p-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-6 rounded-lg shadow-md bg-white/75 dark:bg-gray-800/75 backdrop-blur-sm border border-transparent dark:border-white/20"
        >
          <h1 className="mb-4 text-3xl font-semibold text-center text-indigo-600 dark:text-indigo-400">
            {editLearningPlans ? "Edit Learning Plan" : "Create Learning Plan"}
          </h1>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Please select your subjects
            </label>
            <select
              value={selectedsubjects}
              onChange={(e) => setSelectedsubjects(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {subjects.map((subjects, index) => (
                <option key={index} value={subjects}>
                  {subjects}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Learning Plan Name
            </label>
            <input
              type="text"
              value={learningPlanName}
              onChange={(e) => setLearningPlanName(e.target.value)}
              placeholder="Enter learning plan name"
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hours per Day
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={hoursPerDay}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 1 && value <= 24) {
                  setHoursPerDay(value);
                } else if (e.target.value === "") {
                  setHoursPerDay(""); // allow clearing the input
                }
              }}
              placeholder="Enter hours per day (1–24)"
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Schedule
            </label>
            <select
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select Schedule</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description of your learning
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your learning goals and achievements..."
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 px-4 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-500 rounded-md shadow hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
          >
            {editLearningPlans
              ? "Update Learning Plan"
              : "Create Learning Plan"}
          </button>
          <button
            onClick={goToLearningPlans}
            className="w-full mt-2 px-4 py-2 text-sm font-medium text-black dark:text-white border border-red-600 dark:border-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 transition-colors rounded-md"
          >
            Cancel
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateLearningPlan;
