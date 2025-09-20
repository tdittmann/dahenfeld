import { BackendClient } from "@/plugins/BackendClient.ts";

export interface ContentJson {
  id: number;
  title: string;
  text: string;
  created: string | undefined;
  created_by: string | undefined;
}

export interface Content {
  id: number;
  title: string;
  text: string;
  created: Date | undefined;
  createdBy: string | undefined;
}

const toContent = (json: ContentJson): Content => {
  return {
    id: json.id,
    title: json.title,
    text: json.text,
    created: json.created ? new Date(json.created) : undefined,
    createdBy: json.created_by,
  };
};

const loadContentById = (id: number): Promise<Content | undefined> => {
  return BackendClient.fetchData<ContentJson>(`/content.php?id=${id}`).then(
    (value) => {
      return toContent(value);
    },
  );
};

export const ContentService = {
  loadContentById,
};
