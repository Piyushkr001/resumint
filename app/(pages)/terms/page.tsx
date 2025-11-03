import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function TermsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="space-y-3">
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
          Legal
        </Badge>

        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>

        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Please read these Terms carefully before using Resumint. By creating
          an account or using the product, you agree to these Terms.
        </p>

        <p className="text-xs text-muted-foreground">
          Last updated: <span className="font-medium">November 2025</span>
        </p>
      </section>

      <Separator />

      {/* Summary cards */}
      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">What this covers</CardTitle>
            <CardDescription>Using Resumint as a user.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            These Terms govern your access to and use of Resumint, including
            your account, resume content, ATS analyses, and any related features.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick highlights</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>• You keep ownership of your content.</p>
            <p>• You grant us a license to process it to provide the service.</p>
            <p>• Don&apos;t misuse or attempt to break the platform.</p>
            <p>• We may update these Terms from time to time.</p>
          </CardContent>
        </Card>
      </section>

      {/* Main content */}
      <section className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Using Resumint</CardTitle>
            <CardDescription>Eligibility & account responsibilities.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              You must be at least 16 years old (or the minimum legal age in your
              jurisdiction) to use Resumint. You are responsible for maintaining
              the confidentiality of your account and password and for all
              activities that occur under your account.
            </p>
            <p>
              You agree to provide accurate information when creating an account
              and to keep that information up to date. You may not impersonate any
              person or entity or misrepresent your affiliation with any person or
              entity.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. Your Content</CardTitle>
            <CardDescription>Ownership & license to Resumint.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              You retain all rights to the content you upload or create in
              Resumint (including resumes, job descriptions, notes, and related
              materials).
            </p>
            <p>
              By using the service, you grant Resumint a limited, worldwide,
              non-exclusive, revocable license to store, process, and display your
              content solely for the purpose of operating and improving the
              service (for example: rendering your resume, computing ATS scores,
              or generating analytics).
            </p>
            <p>
              You are responsible for ensuring that you have the necessary rights
              to the content you upload and that it does not infringe any third-party
              rights or applicable laws.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">3. Acceptable Use</CardTitle>
            <CardDescription>What you can&apos;t do with Resumint.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>You agree not to, and not to allow third parties to:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Use Resumint for any unlawful, harmful, or fraudulent purpose.</li>
              <li>Attempt to gain unauthorized access to other users&apos; data.</li>
              <li>Reverse engineer, decompile, or attempt to extract source code.</li>
              <li>Upload malicious code, bots, or scripts that may harm the service.</li>
              <li>
                Misrepresent generated or suggested content as guaranteed hiring results.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">4. Plans, Billing & Trials</CardTitle>
            <CardDescription>Applies if you use paid features.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              If Resumint offers paid plans, you will see pricing and billing
              details before you subscribe. Fees are typically charged on a
              recurring basis until you cancel.
            </p>
            <p>
              Unless stated otherwise, all fees are non-refundable, except where
              required by law. You can cancel your subscription at any time; your
              access to paid features will continue until the end of the billing
              period.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">5. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              The Resumint brand, logo, UI, and underlying technology are owned by
              the Resumint team and/or its licensors. You may not copy, modify, or
              distribute any part of the service unless expressly permitted.
            </p>
            <p>
              You may reference Resumint in portfolios or case studies as a tool
              you used, but you may not present yourself as an official partner or
              representative without prior written consent.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">6. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              You can stop using Resumint at any time and may request deletion of
              your account and associated data as described in our{" "}
              <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <p>
              We may suspend or terminate your access if we reasonably believe you
              are violating these Terms, harming other users, or compromising the
              integrity of the service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">7. Disclaimers & Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              Resumint is provided on an “as is” and “as available” basis. We do
              not guarantee specific hiring outcomes, interview offers, or job
              placements.
            </p>
            <p>
              To the maximum extent permitted by law, Resumint and its team shall
              not be liable for any indirect, incidental, special, consequential,
              or punitive damages arising out of or relating to your use of the
              service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">8. Changes to These Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              We may update these Terms from time to time. When we do, we will
              update the &quot;Last updated&quot; date above and may provide
              additional notice if the changes are significant.
            </p>
            <p>
              Your continued use of Resumint after changes go into effect
              constitutes acceptance of the updated Terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">9. Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              If you have questions about these Terms, you can reach us via the{" "}
              <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
                contact page
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
