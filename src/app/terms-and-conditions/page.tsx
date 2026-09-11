import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Card from "@/components/shared/Card";

export const metadata: Metadata = {
  title: "FedArb ADR | Terms & Conditions",
  description: "Terms and conditions for the FedArb ADR admin portal.",
};

const sections = [
  {
    title: "Use of the Admin Portal",
    body: "The FedArb ADR admin portal is provided for authorized administrative users to view, manage, and support case, user, and invoice workflows within the platform.",
  },
  {
    title: "Authorized Access",
    body: "You are responsible for keeping your login credentials secure. Access must not be shared with unauthorized users, and any suspected misuse should be reported promptly.",
  },
  {
    title: "Case and User Information",
    body: "Information shown in the portal may include case details, participant records, contact information, and billing records. This information should be used only for approved business purposes.",
  },
  {
    title: "Billing and Invoices",
    body: "Billing and invoice information is available for review and tracking. Any financial changes, corrections, or payment processing must follow the approved FedArb ADR operating process.",
  },
  {
    title: "Acceptable Use",
    body: "Users must not attempt to bypass access controls, modify restricted records, copy sensitive information without authorization, or use the portal in a way that disrupts service availability.",
  },
  {
    title: "Updates to These Terms",
    body: "FedArb ADR may update these terms as platform features, security requirements, or operating policies change. Continued use of the admin portal means you accept the updated terms.",
  },
];

const TermsAndConditions = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Terms & Conditions" />
      <Card className="p-5 sm:p-7 lg:p-10">
        <div className="max-w-5xl">
          <p className="text-sm font-medium text-dark-5">
            Last updated: Sep 11, 2026
          </p>
          <h3 className="mt-3 text-xl font-semibold text-primary dark:text-white">
            FedArb ADR Admin Portal Terms
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-dark-5 sm:text-base">
            These terms explain the expected use of the FedArb ADR admin portal
            by authorized administrative users.
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

export default TermsAndConditions;
