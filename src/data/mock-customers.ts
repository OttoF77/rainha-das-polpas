import type { CustomerUser } from "@/types/regional-pricing";

export const MOCK_CUSTOMERS: CustomerUser[] = [
  {
    id: "cust-ce-01",
    name: "Maria Oliveira",
    email: "maria.ce@exemplo.com",
    phone: "(85) 99123-4567",
    document: "123.456.789-01",
    addresses: [
      {
        street: "Avenida Beira Mar",
        number: "1200",
        complement: "Apto 402",
        neighborhood: "Meireles",
        city: "Fortaleza",
        state: "CE",
        postalCode: "60165-121",
      },
    ],
    selectedAddressIndex: 0,
  },
  {
    id: "cust-sp-01",
    name: "Carlos Eduardo Santos",
    email: "carlos.sp@exemplo.com",
    phone: "(11) 98765-4321",
    document: "987.654.321-09",
    addresses: [
      {
        street: "Rua Augusta",
        number: "850",
        neighborhood: "Consolação",
        city: "São Paulo",
        state: "SP",
        postalCode: "01305-100",
      },
    ],
    selectedAddressIndex: 0,
  },
  {
    id: "cust-pi-01",
    name: "Rafael Lima",
    email: "rafael.pi@exemplo.com",
    phone: "(86) 99888-7766",
    document: "456.789.123-45",
    addresses: [
      {
        street: "Avenida Frei Serafim",
        number: "2000",
        neighborhood: "Centro",
        city: "Teresina",
        state: "PI",
        postalCode: "64000-020",
      },
    ],
    selectedAddressIndex: 0,
  },
  {
    id: "cust-no-address",
    name: "Lucas Mendes",
    email: "lucas.pendente@exemplo.com",
    phone: "(85) 98888-0000",
    addresses: [],
  },
  {
    id: "cust-unsupported-am",
    name: "Joana Silva",
    email: "joana.am@exemplo.com",
    phone: "(92) 99999-1111",
    addresses: [
      {
        street: "Avenida Djalma Batista",
        number: "500",
        neighborhood: "Chapada",
        city: "Manaus",
        state: "AM",
        postalCode: "69050-010",
      },
    ],
    selectedAddressIndex: 0,
  },
];
