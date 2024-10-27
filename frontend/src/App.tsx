import React, { useCallback, useState } from "react";

import { BasicInfo, Companion } from "@/components";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

import "./App.css";

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };
  const pageVariants = {
    initial: { opacity: 0, x: "-100%" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100%" }
  };

  const updateProgress = useCallback(() => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  return (
    <div>
      <Progress value={(currentStep / 2) * 100} className="w-full mb-8"  />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="flex-grow flex flex-col"
        >
          {currentStep === 0 && (
            <BasicInfo onSubmit={() => updateProgress()} />
          )}
          {currentStep === 1 && <Companion />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
