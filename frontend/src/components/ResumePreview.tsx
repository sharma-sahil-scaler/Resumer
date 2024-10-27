import { useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";

const ResumePreview = (props: Props) => {
  const { resumeData } = props || {};

  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current && resumeData) {
      const iframeDoc = iframeRef.current.contentDocument;
      iframeDoc.open();
      iframeDoc.write(resumeData);
      iframeDoc.close();
    }
  }, [resumeData]);

  return (
    <Card className="h-[calc(100vh-8rem)] overflow-auto">
      <CardContent className="p-6 h-full	">
        <h2 className="text-2xl font-bold mb-6 text-primary">Resume Preview</h2>
        <iframe
          ref={iframeRef}
          style={{ width: "100%", height: "100%", border: "1px solid #ccc" }}
          title="Resume Preview"
        />
      </CardContent>
    </Card>
  );
};

export default ResumePreview;
