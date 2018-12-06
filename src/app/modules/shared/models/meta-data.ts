export interface IOgMeta {
  title?: string;
  description?: string;
  image?: string;
  site_name?: string;
  type?: string;
}

export interface ITwitterMeta {
  account_id?: string;
  card?: string;
  title?: string;
  site?: string;
  description?: string;
}

export interface IMetaData {
  title?: string;
  keywords?: string;
  description?: string;
  og: IOgMeta;
  twitter: ITwitterMeta;
}

export interface IMetaObject {
  [key: string] : IMetaData;
}
