export type UserStatus = "Active" | "Inactive";

export type UserRecord = {
  id: number;
  name: string;
  firmCompany: string;
  role: string;
  email: string;
  phone: string;
  status: UserStatus;
};

export const users: UserRecord[] = [
  {
    id: 1,
    name: "Vivik",
    firmCompany: "Meridian Corp",
    role: "Case Manager",
    email: "vivkor@gmail.com",
    phone: "+1 202 555 0142",
    status: "Active",
  },
  {
    id: 2,
    name: "Charlis Williams",
    firmCompany: "Williams Legal",
    role: "Neutral",
    email: "charlisW@gmail.com",
    phone: "+1 202 555 0186",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Mark",
    firmCompany: "Pinnacle ADR",
    role: "Lawyer",
    email: "mark@gmail.com",
    phone: "+1 202 555 0129",
    status: "Active",
  },
  {
    id: 4,
    name: "Spy",
    firmCompany: "Hartwell Construction",
    role: "Client",
    email: "spy@gmail.com",
    phone: "+1 202 555 0175",
    status: "Inactive",
  },
  {
    id: 5,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Accounting Staff",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
  {
    id: 6,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Accounting Staff",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
  {
    id: 7,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Neutral",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
  {
    id: 8,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Lawyer",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
  {
    id: 9,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Case Manager",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
  {
    id: 10,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Neutral",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
  {
    id: 12,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Accounting Staff",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
  {
    id: 11,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Case Manager",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
];
