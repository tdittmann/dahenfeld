import { environment } from "@/environment/environment.ts";

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
  return fetch(`${environment.backendUrl}/associations`, {
    headers: new Headers({
      Authorization:
        "Basic " +
        btoa(
          `${environment.backendAuthUser}:${environment.backendAuthPassword}`,
        ),
    }),
  })
    .then((response) => response.json())
    .then((value) => {
      if (value) {
        return value.map(toAssociation);
      }
      return value;
    });
};

const loadAssociationById = (id: number): Promise<Association | undefined> => {
  return fetch(`${environment.backendUrl}/associations?id=${id}`, {
    headers: new Headers({
      Authorization:
        "Basic " +
        btoa(
          `${environment.backendAuthUser}:${environment.backendAuthPassword}`,
        ),
    }),
  })
    .then((response) => response.json())
    .then((value) => {
      if (value) {
        return toAssociation(value);
      }
      return value;
    });
};

export const AssociationsService = {
  loadAssociations,
  loadAssociationById,
};
