import { Card, CardContent } from "./ui/card";

type Props = {};

const ResumePreview = (props: Props) => {
  return (
    <Card className="h-[calc(100vh-8rem)] overflow-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary">Resume Preview</h2>
      </CardContent>
    </Card>
  );
};

export default ResumePreview;
