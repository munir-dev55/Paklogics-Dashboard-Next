import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TableFive from "@/components/Tables/TableFive";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FedArb ADR | Users",
  description: "FedArb ADR | DASHBOARD",
};
const SubscriptionsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Users" />
      <div className="flex flex-col gap-10">
        <TableFive />
      </div>
    </DefaultLayout>
  );
};

export default SubscriptionsPage;
