import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { User, Send } from "lucide-react";
import axios from "axios";

const ChatBox = () => {
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi there! I'm your resume building companion. I will help you make your resume more refined and industry-ready.",
    },
  ]);

  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      // Add user message to chat
      setChatMessages((prev) => [
        ...prev,
        { role: "user", content: userInput },
      ]);
      setUserInput("");
      setIsTyping(true);

      try {
        // Send user message to the backend
        const response = await axios.post("http://localhost:8000/api/chat", {
          message: userInput,
        });

        // Assuming the response contains the assistant's reply
        const assistantMessage = response.data.reply;

        // Add assistant's response to chat
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantMessage },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        // Optionally, handle error response
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I couldn't process your request. Please try again.",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
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
                  <p className="text-sm font-normal text-left	">{message.content}</p>
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