"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

interface AIResumeDialogProps {
  jobDescription: string;
  links: { website: string; github: string; linkedin: string };
  onGenerate: (
    jobDescription: string,
    links: { website: string; github: string; linkedin: string }
  ) => void;
}

export function AIResumeDialog({
  jobDescription,
  links,
  onGenerate
}: AIResumeDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [jd, setJd] = React.useState(jobDescription);
  const [website, setWebsite] = React.useState(links.website);
  const [github, setGithub] = React.useState(links.github);
  const [linkedin, setLinkedin] = React.useState(links.linkedin);

  function handleGenerate() {
    onGenerate(jd, { website, github, linkedin });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-600/90">
          <Sparkles className="h-4 w-4" />
          Build with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Build with AI</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="jd">Job description or career goals</Label>
            <Textarea
              id="jd"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={5}
              placeholder="Paste a job description or describe your goals..."
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/you"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/you"
              />
            </div>
            <div className="md:col-span-2 grid gap-2">
              <Label htmlFor="website">Personal website</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://your-site.com"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerate}>Generate Resume</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
