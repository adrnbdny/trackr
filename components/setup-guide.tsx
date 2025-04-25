"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Steps, Step } from "@/components/ui/steps"

export function SetupGuide() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-500 hover:text-blue-400">
          How to enable Google authentication
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>Setting up Google Authentication</DialogTitle>
          <DialogDescription className="text-gray-400">
            Follow these steps to enable Google authentication in your Supabase project.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Steps>
            <Step title="Go to Supabase Dashboard">
              <p className="text-sm text-gray-400">Log in to your Supabase account and select your project.</p>
            </Step>
            <Step title="Navigate to Authentication">
              <p className="text-sm text-gray-400">
                In the left sidebar, click on "Authentication" and then select "Providers".
              </p>
            </Step>
            <Step title="Enable Google Provider">
              <p className="text-sm text-gray-400">Find Google in the list of providers and toggle it on.</p>
            </Step>
            <Step title="Set up OAuth credentials">
              <p className="text-sm text-gray-400">
                You'll need to create OAuth credentials in the Google Cloud Console. Follow the instructions provided in
                the Supabase dashboard.
              </p>
            </Step>
            <Step title="Add redirect URL">
              <p className="text-sm text-gray-400">
                Add the redirect URL from Supabase to your Google OAuth configuration.
              </p>
            </Step>
            <Step title="Save and test">
              <p className="text-sm text-gray-400">
                Save your changes in both Google Cloud Console and Supabase, then test the authentication.
              </p>
            </Step>
          </Steps>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-400">
            For detailed instructions, refer to the{" "}
            <a
              href="https://supabase.com/docs/guides/auth/social-login/auth-google"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400"
            >
              Supabase documentation
            </a>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
