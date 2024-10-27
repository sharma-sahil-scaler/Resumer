import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Question {
  id: number
  text: string
}

export function YesNoButtonPopupQaSystem({ questions }: { questions: string[] }) {
  const questionList: Question[] = questions.map((text, index) => ({
    id: index + 1, // Assigning ID based on index
    text,
  }))
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const [answers, setAnswers] = useState<Record<number, boolean>>({})
  const [isComplete, setIsComplete] = useState(false)

  const currentQuestion = questionList[currentQuestionIndex]

  const handleAnswer = (answer: boolean) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }))
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setIsComplete(false)
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        {!isComplete ? (
          <>
            <DialogHeader>
              <DialogTitle>Question {currentQuestionIndex + 1}</DialogTitle>
              <DialogDescription>{currentQuestion.text}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-center gap-4 py-4">
              <Button onClick={() => handleAnswer(true)} variant="outline">Yes</Button>
              <Button onClick={() => handleAnswer(false)} variant="outline">No</Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>All Done!</DialogTitle>
              <DialogDescription>Here are your answers:</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {questions.map((q) => (
                <div key={q.id} className="flex justify-between">
                  <span>{q.text}</span>
                  <span className="font-semibold">{answers[q.id] ? "Yes" : "No"}</span>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={handleRestart}>Start Over</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}