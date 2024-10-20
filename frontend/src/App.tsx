import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ProfileForm from "./components/ProfileForm";
import "./App.css";

const App: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const iframeRef = useRef(null);
  const [resumeHtml, setResumeHtml] = useState('');

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

      const profileId = response.data._id;

      const resumeResponse = await axios.get(
        `http://localhost:8000/api/resume/${profileId}`
      );

      setResumeHtml(resumeResponse.data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error creating/updating profile:", error);
    }
  };

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
    </div>
  );
};

export default App;
