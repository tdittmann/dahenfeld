import { BackendClient } from "@/plugins/BackendClient.ts";

export interface AssociationJson {
  id: number;
  name: string;
  subTitle: string;
  description: string;
  logo: string;
  image: string;
  homepage: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
}

export interface Association {
  id: number;
  name: string;
  subTitle: string;
  description: string;
  logo: string;
  image: string;
  homepage: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
}

const toAssociation = (json: AssociationJson): Association => {
  return {
    id: json.id,
    name: json.name,
    subTitle: json.subTitle,
    description: json.description,
    logo: json.logo,
    image: json.image,
    homepage: json.homepage,
    whatsapp: json.whatsapp,
    facebook: json.facebook,
    instagram: json.instagram,
  };
};

const loadAssociations = (): Promise<Association[]> => {
  return BackendClient.fetchData<AssociationJson[]>("/associations").then(
    (value) => {
      return value.map(toAssociation);
    },
  );
};

const loadAssociationById = (id: number): Promise<Association | undefined> => {
  return BackendClient.fetchData<AssociationJson>(
    `/associations?id=${id}`,
  ).then((value) => {
    return toAssociation(value);
  });
};

export const AssociationsService = {
  loadAssociations,
  loadAssociationById,
};
