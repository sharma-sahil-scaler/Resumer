"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";

type Education = {
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
};

type WorkExperience = {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  responsibilities: string[];
};

type Resume = {
  name: string;
  email: string;
  phone: string;
  summary: string;
  education: Education[];
  work_experience: WorkExperience[];
  skills: string[];
};

export default function ProfileForm({ onSubmit }) {
  const [resume, setResume] = useState<Resume>({
    name: "John Doe", // Default name
    email: "john.doe@example.com", // Default email
    phone: "123-456-7890", // Default phone number
    summary:
      "Experienced software developer with a passion for building applications.", // Default summary
    education: [
      {
        institution: "University of Example",
        degree: "Bachelor of Science",
        field_of_study: "Computer Science",
        start_date: "2015-09-01",
        end_date: "2019-06-01"
      }
    ],
    work_experience: [
      {
        company: "Example Corp",
        position: "Software Engineer",
        start_date: "2019-07-01",
        end_date: "2022-12-01",
        responsibilities: [
          "Developed web applications",
          "Collaborated with cross-functional teams"
        ]
      }
    ],
    skills: ["JavaScript", "React", "Node.js"] // Default skills
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setResume((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleWorkExperienceChange = (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => {
    setResume((prev) => ({
      ...prev,
      work_experience: prev.work_experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleResponsibilityChange = (
    expIndex: number,
    respIndex: number,
    value: string
  ) => {
    setResume((prev) => ({
      ...prev,
      work_experience: prev.work_experience.map((exp, i) =>
        i === expIndex
          ? {
              ...exp,
              responsibilities: exp.responsibilities.map((resp, j) =>
                j === respIndex ? value : resp
              )
            }
          : exp
      )
    }));
  };

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: "",
          degree: "",
          field_of_study: "",
          start_date: "",
          end_date: ""
        }
      ]
    }));
  };

  const addWorkExperience = () => {
    setResume((prev) => ({
      ...prev,
      work_experience: [
        ...prev.work_experience,
        {
          company: "",
          position: "",
          start_date: "",
          end_date: "",
          responsibilities: [""]
        }
      ]
    }));
  };

  const addResponsibility = (index: number) => {
    setResume((prev) => ({
      ...prev,
      work_experience: prev.work_experience.map((exp, i) =>
        i === index
          ? { ...exp, responsibilities: [...exp.responsibilities, ""] }
          : exp
      )
    }));
  };

  const addSkill = () => {
    setResume((prev) => ({ ...prev, skills: [...prev.skills, ""] }));
  };

  const removeEducation = (index: number) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const removeWorkExperience = (index: number) => {
    setResume((prev) => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index)
    }));
  };

  const removeResponsibility = (expIndex: number, respIndex: number) => {
    setResume((prev) => ({
      ...prev,
      work_experience: prev.work_experience.map((exp, i) =>
        i === expIndex
          ? {
              ...exp,
              responsibilities: exp.responsibilities.filter(
                (_, j) => j !== respIndex
              )
            }
          : exp
      )
    }));
  };

  const removeSkill = (index: number) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(JSON.stringify(resume, null, 2));

    onSubmit();
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">
          Let's Build Your Resume
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={resume.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={resume.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={resume.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                name="summary"
                value={resume.summary}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Education</h2>
            {resume.education.map((edu, index) => (
              <div
                key={index}
                className="space-y-2 p-4 border rounded-md relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeEducation(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) =>
                    handleEducationChange(index, "institution", e.target.value)
                  }
                  required
                />
                <Input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    handleEducationChange(index, "degree", e.target.value)
                  }
                  required
                />
                <Input
                  placeholder="Field of Study"
                  value={edu.field_of_study}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "field_of_study",
                      e.target.value
                    )
                  }
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={edu.start_date}
                    onChange={(e) =>
                      handleEducationChange(index, "start_date", e.target.value)
                    }
                    required
                  />
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={edu.end_date}
                    onChange={(e) =>
                      handleEducationChange(index, "end_date", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addEducation}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Education
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Work Experience</h2>
            {resume.work_experience.map((exp, expIndex) => (
              <div
                key={expIndex}
                className="space-y-2 p-4 border rounded-md relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeWorkExperience(expIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) =>
                    handleWorkExperienceChange(
                      expIndex,
                      "company",
                      e.target.value
                    )
                  }
                  required
                />
                <Input
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) =>
                    handleWorkExperienceChange(
                      expIndex,
                      "position",
                      e.target.value
                    )
                  }
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={exp.start_date}
                    onChange={(e) =>
                      handleWorkExperienceChange(
                        expIndex,
                        "start_date",
                        e.target.value
                      )
                    }
                    required
                  />
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={exp.end_date}
                    onChange={(e) =>
                      handleWorkExperienceChange(
                        expIndex,
                        "end_date",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Responsibilities</Label>
                  {exp.responsibilities.map((resp, respIndex) => (
                    <div
                      key={respIndex}
                      className="flex items-center space-x-2"
                    >
                      <Input
                        placeholder="Responsibility"
                        value={resp}
                        onChange={(e) =>
                          handleResponsibilityChange(
                            expIndex,
                            respIndex,
                            e.target.value
                          )
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          removeResponsibility(expIndex, respIndex)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addResponsibility(expIndex)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Responsibility
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addWorkExperience}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Work Experience
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Skills</h2>
            {resume.skills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="Skill"
                  value={skill}
                  onChange={(e) => {
                    const newSkills = [...resume.skills];
                    newSkills[index] = e.target.value;
                    setResume((prev) => ({ ...prev, skills: newSkills }));
                  }}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSkill(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSkill}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          </div>

          <Button type="submit" className="w-full">
            Create Resume
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
