import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ProfileForm from "./components/ProfileForm";
import { YesNoButtonPopupQaSystem } from "./components/yes-no-button-popup-qa-system"; // Import the popup component
import "./App.css";

const App: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const iframeRef = useRef(null);
  const [resumeHtml, setResumeHtml] = useState('');
  const [profileId, setProfileId] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [questions, setQuestions] = useState<string[]>([]); // State to store questions

  useEffect(() => {
    if (iframeRef.current && resumeHtml) {
      const iframeDoc = iframeRef.current.contentDocument;
      iframeDoc.open();
      iframeDoc.write(resumeHtml);
      iframeDoc.close();
    }
  }, [resumeHtml]);

  const handleCreateOrUpdateProfile = async (profile: any) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/profile",
        profile
      );

      const pId = response.data._id;

      setProfileId(pId)

      const resumeResponse = await axios.get(
        `http://localhost:8000/api/resume/${pId}`
      );

      setResumeHtml(resumeResponse.data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error creating/updating profile:", error);
    }
  };

  const fetchSuggestions = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/suggestion/${profileId}`);
      setQuestions(response.data); // Assuming response.data is an array of questions
      setShowPopup(true); // Show the popup when suggestions are fetched
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, [profileId]);

  useEffect(() => {
    if(isSubmitted) {
      fetchSuggestions()
    }
  }, [fetchSuggestions, isSubmitted])

  return (
    <div className="flex min-h-screen">
      <motion.div
        className="w-full lg:w-1/2 p-6 overflow-y-auto mx-auto"
        animate={{ x: isSubmitted ? '-25%' : 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProfileForm onSubmit={handleCreateOrUpdateProfile} />
      </motion.div>

      <AnimatePresence>
        {isSubmitted && (
          <div className="flex flex-col w-full lg:w-1/2 p-6 overflow-y-auto mx-auto">
            <h2 className="text-3xl font-bold mb-4">Your Resume</h2>
            <iframe 
              ref={iframeRef} 
              style={{ width: '100%', height: '100%', border: '1px solid #ccc' }}
              title="Resume Preview"
            />
          </div>
        )}
      </AnimatePresence>

      {showPopup && (
        <YesNoButtonPopupQaSystem questions={questions} />
      )}
    </div>
  );
};

export default App;
