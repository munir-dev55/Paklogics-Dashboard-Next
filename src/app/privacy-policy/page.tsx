import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Card from "@/components/shared/Card";

export const metadata: Metadata = {
  title: "FedArb ADR | Privacy Policy",
  description: "Privacy policy for the FedArb ADR admin portal.",
};

const sections = [
  {
    title: "Information We Process",
    body: "The admin portal may display user names, firm or company details, roles, contact information, case records, invoice details, and account status information.",
  },
  {
    title: "How Information Is Used",
    body: "Portal information is used to support administrative workflows, case coordination, user management, billing review, reporting, and service operations.",
  },
  {
    title: "Access and Security",
    body: "Access is limited to authorized users. Administrative users should only view or handle information needed for their assigned responsibilities.",
  },
  {
    title: "Data Sharing",
    body: "Information from the portal should not be shared outside approved FedArb ADR processes unless required for case administration, billing support, compliance, or legal obligations.",
  },
  {
    title: "Data Accuracy",
    body: "Users should report inaccurate or outdated records through the proper internal process so platform information can remain reliable and useful.",
  },
  {
    title: "Policy Updates",
    body: "This privacy policy may be updated when platform features, data practices, or operational requirements change.",
  },
];

const PrivacyPolicy = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Privacy Policy" />
      <Card className="p-5 sm:p-7 lg:p-10">
        <div className="max-w-5xl">
          <p className="text-sm font-medium text-dark-5">
            Last updated: Sep 11, 2026
          </p>
          <h3 className="mt-3 text-xl font-semibold text-primary dark:text-white">
            FedArb ADR Admin Portal Privacy Policy
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-dark-5 sm:text-base">
            This policy explains how information is handled inside the FedArb
            ADR admin portal.
          </p>
        </div>

        <div className="mt-8 max-w-4xl space-y-6">
          {sections.map((section, index) => (
            <section key={section.title}>
              <h4 className="text-base font-semibold text-primary dark:text-white">
                {index + 1}. {section.title}
              </h4>
              <p className="mt-2 text-sm leading-7 text-dark-5 sm:text-base">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </Card>
    </DefaultLayout>
  );
};

export default PrivacyPolicy;
