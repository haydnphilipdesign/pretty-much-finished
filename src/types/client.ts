export interface Client {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: "buyer" | "seller";
}
