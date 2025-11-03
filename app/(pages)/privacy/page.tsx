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

import { ShieldCheck, Lock, Eye, Server, Trash2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="space-y-3">
        <Badge variant="secondary" className="gap-2 rounded-full px-3 py-1 text-xs">
          <ShieldCheck className="h-3.5 w-3.5" />
          Privacy
        </Badge>

        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>

        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Your data is at the core of Resumint. This Privacy Policy explains what
          we collect, how we use it, and the choices you have.
        </p>

        <p className="text-xs text-muted-foreground">
          Last updated: <span className="font-medium">November 2025</span>
        </p>
      </section>

      <Separator />

      {/* Summary row */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Lock className="h-4 w-4 text-emerald-600" />
              Data ownership
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            You own your resume content. We process it only to provide and improve
            the service.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4 text-sky-600" />
              No hidden selling
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            We don&apos;t sell your personal data to third-party marketers.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Trash2 className="h-4 w-4 text-rose-600" />
              Control & deletion
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            You can request deletion of your account and associated content.
          </CardContent>
        </Card>
      </section>

      {/* Main content */}
      <section className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Information We Collect</CardTitle>
            <CardDescription>What we need to operate Resumint.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>We collect the following categories of information:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <span className="font-medium text-foreground">Account data:</span>{" "}
                name, email address, authentication metadata (e.g., login provider).
              </li>
              <li>
                <span className="font-medium text-foreground">Resume content:</span>{" "}
                experience, education, skills, job descriptions, and related fields
                you enter.
              </li>
              <li>
                <span className="font-medium text-foreground">Usage data:</span>{" "}
                actions such as creating resumes, running ATS analyses, and viewing
                analytics; device and browser information in aggregate.
              </li>
              <li>
                <span className="font-medium text-foreground">Support data:</span>{" "}
                messages you send via forms or email when you contact us.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              We use your information to provide, maintain, and improve Resumint,
              including:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Rendering and exporting your resumes.</li>
              <li>Computing ATS scores and relevance metrics.</li>
              <li>Providing analytics, preferences, and settings.</li>
              <li>Securing the platform and preventing abuse.</li>
              <li>Communicating about updates, security, and support.</li>
            </ul>
            <p>
              We may also use anonymized or aggregated data (that does not identify
              you) to improve features and understand general usage patterns.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">3. Cookies & Similar Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              Resumint may use cookies or similar technologies to keep you signed
              in, remember preferences, and measure product usage in aggregate.
            </p>
            <p>
              You can control cookie behavior via your browser settings, but some
              parts of the product may not function properly if certain cookies are
              disabled.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">4. Data Storage & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              We use modern hosting and security practices to protect your data,
              including encrypted connections (HTTPS) and restricted access to
              production systems.
            </p>
            <p>
              No method of transmission or storage is 100% secure, but we work to
              follow industry best practices appropriate for the size and nature of
              the product.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
                <Server className="h-3 w-3" />
                Encrypted in transit
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
                <Lock className="h-3 w-3" />
                Limited access
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">5. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              We retain your personal data for as long as your account is active or
              as needed to provide the service. If you request deletion, we will
              remove or anonymize your data within a reasonable timeframe, subject
              to technical and legal limitations.
            </p>
            <p>
              Some aggregated or de-identified data may be retained for analytics
              or product safety even after account deletion.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">6. Sharing & Third Parties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>We may share your data only in limited circumstances:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                With infrastructure or analytics providers that help us run
                Resumint (e.g., hosting, email, error tracking), under appropriate
                agreements.
              </li>
              <li>
                When required by law, regulation, or legal process, if we believe
                disclosure is reasonably necessary.
              </li>
              <li>
                In connection with a merge, acquisition, or similar event, where
                your data may be transferred to a successor entity with notice.
              </li>
            </ul>
            <p>
              We do not sell your personal information to third-party advertisers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">7. Your Rights & Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              Depending on your jurisdiction, you may have rights such as accessing,
              correcting, or deleting your personal data, or exporting it in a
              portable format.
            </p>
            <p>
              To exercise these rights, you can use in-product controls where
              available (e.g., account settings) or contact us via the{" "}
              <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
                contact page
              </Link>
              .
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">8. Children&apos;s Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              Resumint is not directed to children under the age of 16, and we do
              not knowingly collect personal information from children under that
              age. If you believe a child has provided us with personal data, please
              contact us and we will take appropriate steps.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">9. Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              We may update this Privacy Policy periodically. When we do, we will
              update the &quot;Last updated&quot; date above and may provide
              additional notice where required.
            </p>
            <p>
              Your continued use of Resumint after changes become effective
              constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">10. Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              If you have questions or concerns about this Privacy Policy, please
              reach out via the{" "}
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
