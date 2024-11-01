import ResumePreview from "./ResumePreview";
import ChatBox from "./ChatBox";

const Companion = ({ profileData }) => {
  const { resumeData, profileId } = profileData || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full w-10/12	">
      <ResumePreview {...{ resumeData }} />
      <ChatBox {...{ profileId }} />
    </div>
  );
};

export default Companion;
