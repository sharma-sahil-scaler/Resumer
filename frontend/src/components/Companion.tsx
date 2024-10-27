import ResumePreview from "./ResumePreview";
import ChatBox from "./ChatBox";

const Companion = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <ResumePreview />
      <ChatBox />
    </div>
  );
};

export default Companion;
