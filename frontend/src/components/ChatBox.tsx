import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { User, Send } from "lucide-react";

const ChatBox = () => {
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi there! I'm your resume building companion. Let's start by focusing on your current or most recent job. What's your job title?"
    }
  ]);

  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      setChatMessages([...chatMessages, { role: "user", content: userInput }]);
      setUserInput("");
      setIsTyping(true);
      // Simulate companion response (in a real app, this would be handled by an AI)
      setTimeout(() => {
        setIsTyping(false);
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Great! Can you tell me about your key responsibilities in this role? Try to be specific and use action verbs."
          }
        ]);
      }, 2000);
    }
  };

  return (
    <Card className="h-[calc(100vh-8rem)] flex flex-col">
      <CardContent className="flex-grow overflow-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary">
          Chat with Your Resume Companion
        </h2>
        <div className="space-y-4">
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start gap-2.5 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar
                  className={
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }
                >
                  <AvatarFallback>
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      "🤖"
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-s-xl rounded-ee-xl"
                      : "bg-muted rounded-e-xl rounded-es-xl"
                  }`}
                >
                  <p className="text-sm font-normal">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-full px-4 py-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <div className="p-4 border-t">
        <form
          onSubmit={handleChatSubmit}
          className="flex items-center space-x-2"
        >
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow transition-all duration-300 focus:ring-2 focus:ring-primary"
          />
          <Button
            type="submit"
            size="icon"
            className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatBox;
