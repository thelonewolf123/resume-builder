import { ResumeBuilder } from "@/components/resume-builder"

export default function Page() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <span id="builder" className="sr-only">
          Builder
        </span>
        <ResumeBuilder />
      </main>
    </>
  )
}
